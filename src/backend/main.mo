import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Tool = {
    name : Text;
    description : Text;
    urlTemplate : Text;
  };

  type Message = {
    sender : Text;
    text : Text;
    timestamp : Nat64;
  };

  public type UserProfile = {
    name : Text;
  };

  // Persistent state for tools and conversation history
  let userTools = Map.empty<Principal, List.List<Tool>>();
  let conversationHistory = Map.empty<Principal, List.List<Message>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user: Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Custom tool management - requires user authentication
  public query ({ caller }) func getTools() : async [Tool] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access custom tools");
    };
    switch (userTools.get(caller)) {
      case (null) { [] };
      case (?tools) { tools.toArray() };
    };
  };

  public shared ({ caller }) func addTool(tool : Tool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add custom tools");
    };
    if (tool.name.trim(#char ' ').size() == 0 or tool.urlTemplate.trim(#char ' ').size() == 0) {
      return ();
    };
    let existing = switch (userTools.get(caller)) {
      case (null) { List.empty<Tool>() };
      case (?tools) { tools };
    };
    existing.add(tool);
    userTools.add(caller, existing);
  };

  // Conversation history management - requires user authentication
  public query ({ caller }) func getConversationHistory() : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access conversation history");
    };
    switch (conversationHistory.get(caller)) {
      case (null) { [] };
      case (?messages) { messages.toArray() };
    };
  };

  public shared ({ caller }) func saveMessage(message : Message) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save messages");
    };
    let existing = switch (conversationHistory.get(caller)) {
      case (null) { List.empty<Message>() };
      case (?messages) { messages };
    };
    existing.add(message);
    // Limit history size to last 100 messages
    let limitedMessages = existing.toArray().sliceToArray(0, 100);
    let limitedList = List.fromArray<Message>(limitedMessages);
    conversationHistory.add(caller, limitedList);
  };

  // Built-in concierge tools - available to all users including guests
  public query ({ caller }) func getConciergeTools() : async [Tool] {
    [
      {
        name = "Web Search";
        description = "Search the web for information using your preferred search engine.";
        urlTemplate = "https://www.google.com/search?q={query}";
      },
      {
        name = "Open Website";
        description = "Open a specific website by providing its URL.";
        urlTemplate = "{url}";
      },
      {
        name = "Play YouTube Video";
        description = "Find and play a YouTube video by searching for a specific query.";
        urlTemplate = "https://www.youtube.com/results?search_query={query}";
      },
    ];
  };
};
