function findMeetId(url){
    var str = url.slice(24);
    var def = "none";
    if(str.length <= 11) return def;
    str = str.slice(0,12);
    if(str[0]=="_") return def;
    return str;
}
const publicVapidKey = 'BPq4A4ShxxzqxjjmWyPW7hHwgi9ihdOyGegB87hhAg1OQjcSM1MKpQZKx4nRyTB_3T5oleuGyIUIA9RVuPxaABA';
function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
chrome.identity.getProfileUserInfo(function(info) { 
    email = info.email; 
    chrome.storage.sync.set({'email':email});
});
navigator.serviceWorker.onmessage = function(event) {
     var data = event.data;
    // if (data.command == "broadcastOnRequest") {
    //     console.log("Broadcasted message from the ServiceWorker : ", data.message);
    // }
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {
          type: data.type,
          option_a: data.option_a,
          option_b: data.option_b,
          option_c: data.option_c,
          option_d: data.option_d,
          question: data.question
        });  
    });
};
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    if(request.todo == "markAttendance"){
        console.log(request);
        const authtoken = "JWT "+request.token;
        fetch('http://localhost:8000/api/attendance-response', {
            method: 'POST',
            body: JSON.stringify({
                student_id: request.userid,
                meet_link: request.meet_link
            }),
            headers: {
                'Content-type': 'application/json',
                'Authorization': authtoken
            },
        })
        // .then(function(response){
        //     console.log(response.status);
        //     return response.json();
        // })
        // .then(function(json){
        //     //action on response
        //     console.log(json);
        // });
    }
    else if(request.todo == "markAnswer"){
      console.log(request);
      const authtoken = "JWT "+request.token;
      fetch('http://localhost:8000/api/quiz-response', {
          method: 'POST',
          body: JSON.stringify({
              meet_link: request.meet_link,
              answer: request.option,
              student_id: request.userid
          }),
          headers: {
              'Content-type': 'application/json',
              'Authorization': authtoken
          },
      })
      // .then(function(response){
      //     console.log(response.status);
      //     return response.json();
      // })
      // .then(function(json){
      //     //action on response
      //     console.log(json);
      // });
    }
    else if(request.todo == "showPageAction"){
        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
            chrome.pageAction.show(tabs[0].id);
            var url = tabs[0].url;
            var meetid = findMeetId(url);
            chrome.storage.sync.set({'meetId':meetid});
            if ('serviceWorker' in navigator) {
                console.log('Registering service worker');
                run().catch(error => console.error(error));
              }
              
              async function run() {
                console.log('Registering service worker');
                const registration = await navigator.serviceWorker.
                  register('worker.js');
                console.log('Registered service worker');
              
                console.log('Registering push');
                const subscription = await registration.pushManager.
                  subscribe({
                    userVisibleOnly: true,
                    // The `urlBase64ToUint8Array()` function is the same as in
                    // https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
                    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
                  });
                console.log('Registered push');
              
                var myemail;
                chrome.identity.getProfileUserInfo(function(info) { 
                    myemail = info.email;
                    console.log('Sending push');
                    // fetch('http://localhost:3000/subscribe', {
                    //   method: 'POST',
                    //   body: JSON.stringify(subscription),
                    //   headers: {
                    //     'content-type': 'application/json'
                    //   }
                    // });
                    const mysubscription = {
                        email: myemail,
                        meet_link: "https://meet.google.com/"+meetid,
                        token1: subscription.endpoint,
                        token2: subscription.toJSON().keys.p256dh,
                        token3: subscription.toJSON().keys.auth
                    }
                    console.log(mysubscription);
                    fetch('http://localhost:8000/api/subscribe', {
                      method: 'POST',
                      body: JSON.stringify(mysubscription),
                      headers: {
                        'content-type': 'application/json'
                      }
                    });
                    console.log('Subscribed');
                });
              }
        });
    }
});
