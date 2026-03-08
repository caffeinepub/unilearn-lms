import Set "mo:core/Set";
import List "mo:core/List";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  type Subject = Text;
  type UserRole = { #admin; #faculty; #student };
  type UserProfile = {
    name : Text;
    email : Text;
    role : UserRole;
  };

  module UserProfile {
    public func compareByEmail(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      Text.compare(profile1.email, profile2.email);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  private func isFaculty(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.role) {
          case (#faculty) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  private func isStudent(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.role) {
          case (#student) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    switch (profile.role) {
      case (#admin) {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only admins can assign admin role");
        };
      };
      case (_) {};
    };
    userProfiles.add(caller, profile);
  };

  type Material = {
    title : Text;
    subject : Text;
    fileType : Text;
    uploadedBy : Principal;
    uploadTime : Time.Time;
    file : Storage.ExternalBlob;
  };

  module Material {
    public func compareByTitle(material1 : Material, material2 : Material) : Order.Order {
      Text.compare(material1.title, material2.title);
    };
    public func compareBySubject(material1 : Material, material2 : Material) : Order.Order {
      Text.compare(material1.subject, material2.subject);
    };
  };

  let materials = Map.empty<Text, Material>();
  include MixinStorage();

  public shared ({ caller }) func uploadMaterial(title : Text, subject : Text, fileType : Text, file : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upload materials");
    };

    if (not isFaculty(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only faculty can upload materials");
    };

    if (materials.containsKey(title)) {
      Runtime.trap("Material with this title already exists");
    };

    let newMaterial : Material = {
      title;
      subject;
      fileType;
      uploadedBy = caller;
      uploadTime = Time.now();
      file;
    };

    materials.add(title, newMaterial);
  };

  public query ({ caller }) func getMaterial(title : Text) : async Material {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view materials");
    };

    switch (materials.get(title)) {
      case (null) { Runtime.trap("Material not found") };
      case (?material) { material };
    };
  };

  public query ({ caller }) func getMaterialsBySubject(subject : Text) : async [Material] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view materials");
    };
    materials.values().toArray().filter(
      func(material) {
        material.subject == subject;
      }
    );
  };

  public query ({ caller }) func getAllMaterials() : async [Material] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view materials");
    };
    materials.values().toArray();
  };

  public query ({ caller }) func getAllUniqueSubjects() : async [Subject] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view subjects");
    };

    let uniqueSubjects = Set.empty<Subject>();
    for (material in materials.values()) {
      uniqueSubjects.add(material.subject);
    };
    uniqueSubjects.toArray();
  };

  type Assignment = {
    title : Text;
    description : Text;
    deadline : Text;
    subject : Text;
    createdBy : Principal;
  };

  module Assignment {
    public func compareByTitle(assign1 : Assignment, assign2 : Assignment) : Order.Order {
      Text.compare(assign1.title, assign2.title);
    };
    public func compareBySubject(assign1 : Assignment, assign2 : Assignment) : Order.Order {
      Text.compare(assign1.subject, assign2.subject);
    };
  };

  let assignments = Map.empty<Text, Assignment>();

  public query ({ caller }) func getAssignment(title : Text) : async Assignment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view assignments");
    };

    switch (assignments.get(title)) {
      case (null) { Runtime.trap("Assignment not found") };
      case (?assignment) { assignment };
    };
  };

  public query ({ caller }) func getAssignmentsBySubject(subject : Text) : async [Assignment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view assignments");
    };
    assignments.values().toArray().filter(
      func(assignment) { assignment.subject == subject } // Only filter by subject here
    );
  };

  public query ({ caller }) func getAllAssignments() : async [Assignment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view assignments");
    };
    assignments.values().toArray();
  };

  public shared ({ caller }) func createAssignment(title : Text, description : Text, deadline : Text, subject : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create assignments");
    };

    if (not isFaculty(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only faculty can create assignments");
    };

    if (assignments.containsKey(title)) {
      Runtime.trap("Assignment with this title already exists");
    };

    let newAssignment : Assignment = {
      title;
      description;
      deadline;
      subject;
      createdBy = caller;
    };

    assignments.add(title, newAssignment);
  };

  type Submission = {
    student : Principal;
    assignmentTitle : Text;
    timestamp : Time.Time;
    notes : Text;
    file : Storage.ExternalBlob;
  };

  module Submission {
    public func compareByAssignmentTitle(sub1 : Submission, sub2 : Submission) : Order.Order {
      Text.compare(sub1.assignmentTitle, sub2.assignmentTitle);
    };
    public func compareByStudent(sub1 : Submission, sub2 : Submission) : Order.Order {
      Text.compare(sub1.student.toText(), sub2.student.toText());
    };
  };

  let submissions = Map.empty<Text, Submission>();

  public shared ({ caller }) func submitAssignment(assignmentTitle : Text, notes : Text, file : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit assignments");
    };

    if (not isStudent(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only students can submit assignments");
    };

    if (not assignments.containsKey(assignmentTitle)) {
      Runtime.trap("Assignment does not exist");
    };

    let submissionKey = assignmentTitle # caller.toText();

    let newSubmission : Submission = {
      student = caller;
      assignmentTitle;
      timestamp = Time.now();
      notes;
      file;
    };

    submissions.add(submissionKey, newSubmission);
  };

  type Attendance = {
    student : Principal;
    date : Text;
    present : Bool;
    markedBy : Principal;
  };

  module Attendance {
    public func compareByDate(attendance1 : Attendance, attendance2 : Attendance) : Order.Order {
      Text.compare(attendance1.date, attendance2.date);
    };
    public func compareByStudent(attendance1 : Attendance, attendance2 : Attendance) : Order.Order {
      Text.compare(attendance1.student.toText(), attendance2.student.toText());
    };
  };

  let attendanceRecords = List.empty<Attendance>();

  public shared ({ caller }) func markAttendance(student : Principal, date : Text, present : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can mark attendance");
    };

    if (not isFaculty(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only faculty can mark attendance");
    };

    let record : Attendance = {
      student;
      date;
      present;
      markedBy = caller;
    };

    attendanceRecords.add(record);
  };

  public query ({ caller }) func getAttendanceByStudent(student : Principal) : async [Attendance] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view attendance");
    };

    if (caller != student and not isFaculty(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Students can only view their own attendance");
    };

    attendanceRecords.toArray().filter(
      func(record) {
        record.student == student;
      }
    );
  };

  public query ({ caller }) func getAttendanceByDate(date : Text) : async [Attendance] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view attendance");
    };

    if (not isFaculty(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only faculty can view attendance by date");
    };

    attendanceRecords.toArray().filter(
      func(record) {
        record.date == date;
      }
    );
  };

  public query ({ caller }) func getAllAttendanceRecords() : async [Attendance] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view attendance");
    };

    if (not isFaculty(caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only faculty can view all attendance records");
    };

    attendanceRecords.toArray();
  };

  public query ({ caller }) func getChatbotResponse(question : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can use the chatbot");
    };

    "Q: " # question # "\nA: This is a mock academic response. Please refer to your study materials for detailed information.";
  };

  public query ({ caller }) func getSystemAnalytics() : async (Nat, Nat, Nat, Nat) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can view system analytics");
    };

    (materials.size(), assignments.size(), submissions.size(), attendanceRecords.size());
  };
};
