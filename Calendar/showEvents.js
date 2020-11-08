// Client ID and API key from the Developer Console
var CLIENT_ID = '498389224270-tth80803cgevktginii63sjqkdcmm26i.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAzVGlDFNKENjVy8Ev3jeK8powqNBRcTMs';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
}).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
}, function(error) {
    appendPre(JSON.stringify(error, null, 2));
});
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    welcomeUser()
    listUpcomingEvents();
} else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
}
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
var pre = document.getElementById('content');
var textContent = document.createTextNode(message + '\n');
pre.appendChild(textContent);
}

/**
 * Print a welcome message for the user once they have logged in.
 */
function welcomeUser() {
    var profile = gapi.auth2.getAuthInstance().currentUser.get()
    userName = profile.getBasicProfile().getName()
    document.getElementById('welcomeMessage').innerHTML = 'Welcome, ' + userName + '! Here are some Spotify playlists for your day.';
}


/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
start = new Date();
start.setHours(0,0,0,0);
end = new Date();
end.setHours(23,23,59,59);
gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': start.toISOString(),
    'timeMax': end.toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
}).then(function(response) {
    var events = response.result.items;
    
    if (events.length > 0){
        for (i = 0; i < events.length; i++) {
            var event = events[i];
            playlist_url = null;

            if (event.summary.toLowerCase().includes("study")){
                playlist_url = "https://open.spotify.com/embed/playlist/37i9dQZF1DX8NTLI2TtZa6";
            }
            else if ((event.summary.toLowerCase().includes("gym"))||(event.summary.includes("workout"))){
                playlist_url = "https://open.spotify.com/embed/playlist/7bN9SOW0HJhzaXiukGKrM0";
            }
            else if (event.summary.toLowerCase().includes("run")){
                playlist_url = "https://open.spotify.com/embed/playlist/4cgeOaRCHDkVDQPaDrRQFR";
            }
            else if ((event.summary.toLowerCase().includes("hangout"))||(event.summary.includes("chill"))){
                playlist_url = 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6';
            }
            else if ((event.summary.toLowerCase().includes("road trip"))||(event.summary.includes("drive"))){
                playlist_url = 'https://open.spotify.com/embed/album/4INtVvtW2OSy4FsYislcw3';
            }
            else if ((event.summary.toLowerCase().includes("party"))||(event.summary.includes("pre"))||(event.summary.includes("go out"))){
                playlist_url = "https://open.spotify.com/embed/playlist/6VdvufagCnB6BS52MxwPRw";
            }
            else if ((event.summary.toLowerCase().includes("dinner"))||(event.summary.includes("cooking"))){
                playlist_url = "https://open.spotify.com/embed/playlist/5ifODq96sBfaOY1mJKDr2I";
            }
            else if ((event.summary.toLowerCase().includes("breakfast"))||(event.summary.includes("lunch"))){
                playlist_url = "https://open.spotify.com/embed/playlist/63I5Q0ljfj1CgVFGVAgpWy";
            }
            else if ((event.summary.toLowerCase().includes("shower"))||(event.summary.includes("get ready"))){
                playlist_url = "https://open.spotify.com/embed/playlist/2QtbwqE8JcEp24augCTtjM";
            }
            else if ((event.summary.toLowerCase().includes("church"))||(event.summary.toLowerCase().includes("praise"))){
                playlist_url = "https://open.spotify.com/embed/playlist/37i9dQZF1DXdrxKdrXE2Vk";
            }
 
            // append p element to HTML
            var eventName = document.createElement("P");
            time = event.start.dateTime.substr(11, 5);

            // add playlist into HTML
            if (playlist_url != null) {
                // create iframe element
                var playlist = document.createElement("IFRAME");
                // set iframe attributes
                playlist.width = '600';
                playlist.height = '300';
                playlist.frameborder = '0';
                playlist.allowtransparency = 'true';
                playlist.allow = 'encrypted-media';
                playlist.setAttribute('src', playlist_url)

                eventName.innerText = time + ": " + event.summary;
                document.getElementById("main").appendChild(eventName);
                // append iframe element to HTML
                document.getElementById("main").appendChild(playlist);

            }
            else{
                //var noEventsMessage = document.createElement("P");
                eventName.innerText = time + ": " + event.summary + ": There are no playlists for this activities.";
                document.getElementById("main").appendChild(eventName);
            }
        }
    }
    else{
        document.getElementById("noEvents").style.display = "block";
        }
    
});
}

