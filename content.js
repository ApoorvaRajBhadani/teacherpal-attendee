chrome.runtime.sendMessage({todo:"showPageAction"});
chrome.runtime.onMessage.addListener(function (response, sendResponse) {
  console.log(response);
  if(response.type=='attendance'){
    $("#injected").css({
      display: 'block'
    });
  }else if(response.type=='quiz'){
    $("#quizinjected").css({
      display: 'block'
    });
    $("#quizquestion").text(response.question);
    $("#submitOptionA").prop('value', response.option_a);
    $("#submitOptionB").prop('value', response.option_b);
    $("#submitOptionC").prop('value', response.option_c);
    $("#submitOptionD").prop('value', response.option_d);
  }
  var timeleft = 10;
  $(".timer").text(timeleft+" seconds");
  var downloadTimer = setInterval(function(){
    if(timeleft <= 0){
      clearInterval(downloadTimer);
      //document.getElementById("countdown").innerHTML = "Finished";
      $(".timer").text("Time Over");
      $("#injected").css({
        display: 'none'
      });
      $("#quizinjected").css({
        display: 'none'
      });
    } else {
      //document.getElementById("countdown").innerHTML = timeleft + " seconds remaining";
      $(".timer").text(timeleft+" seconds");
    }
    timeleft -= 1;
  }, 1000);
});
$('body').append(`
  <div id="injected">
      <h3 id="areyoupres">Are you present?</h3>
      <input class="innerele" type="submit" value="Yes" id="btnPresent">
      <b>Time Left: </b>
      <b id="timer" class="timer"> </b>
  </div>
`);
$('#injected').css({
  'border-style': 'solid',
  padding: '15px 15px 15px 15px',
  width: '300px',
  height: '150px',
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: '100',
  display: 'none',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgb(250,250,250)',
});
$("#areyoupres").css({
  position: 'absolute',
  left: '50%',
  top: '30%',
  transform: 'translate(-50%, -50%)',
});
$("#btnPresent").css({
  position: 'absolute',
  left: '50%',
  top: '60%',
  transform: 'translate(-50%, -50%)',
});

//I am present button clicked
$("#btnPresent").click(function(){
  //find email meetId attendanceId
  chrome.storage.sync.get(['meetId','id','token'],function(data){
      var meetid = data.meetId;
      var userid = data.id;
      const token = data.token;
      //make post request
      if(meetid!="none"){
        chrome.runtime.sendMessage({todo:"markAttendance",userid:userid,token:token,meet_link:"https://meet.google.com/"+meetid });
        //action on response
          $("#injected").css({
           display: 'none'
          });
      }
      });
});

$('body').append(`
  <div id="quizinjected">
    <b>Time Left: </b>
    <b class="timer" id="quiztimer"> </b>
    <h3 id="quizquestion">Who is the first President of India?</h3>
    <input class="innerele" type="submit" value="Mark A" id="submitOptionA">
    <br><br>
    <input class="innerele" type="submit" value="Mark B" id="submitOptionB">
    <br><br>
    <input class="innerele" type="submit" value="Mark C" id="submitOptionC">
    <br><br>
    <input class="innerele" type="submit" value="Mark D" id="submitOptionD">
  </div>
`);
$('#quizinjected').css({
  'border-style': 'solid',
  padding: '15px 15px 15px 15px',
  width: '300px',
  height: '220px',
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: '100',
  display: 'none',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgb(250,250,250)',
});

//Option A submitted as answer
$("#submitOptionA").click(function(){
  //find email meetId attendanceId
  chrome.storage.sync.get(['meetId','id','token'],function(data){
      var userid = data.id;
      var meetid = data.meetId;
      const token = data.token;
      //make post request
      if(meetid!="none"){
        chrome.runtime.sendMessage({todo:"markAnswer",option:'A',userid:userid,token:token,meet_link:"https://meet.google.com/"+meetid });
        //action on response
          $("#quizinjected").css({
           display: 'none'
          });
      }
      });
});
//Option B submitted as answer
$("#submitOptionB").click(function(){
  //find email meetId attendanceId
  chrome.storage.sync.get(['meetId','id','token'],function(data){
      var userid = data.id;
      var meetid = data.meetId;
      const token = data.token;
      //make post request
      if(meetid!="none"){
        chrome.runtime.sendMessage({todo:"markAnswer",option:'B',userid:userid,token:token,meet_link:"https://meet.google.com/"+meetid });
        //action on response
          $("#quizinjected").css({
           display: 'none'
          });
      }
      });
});
//Option C submitted as answer
$("#submitOptionC").click(function(){
  //find email meetId attendanceId
  chrome.storage.sync.get(['meetId','id','token'],function(data){
      var userid = data.id;
      var meetid = data.meetId;
      const token = data.token;
      //make post request
      if(meetid!="none"){
        chrome.runtime.sendMessage({todo:"markAnswer",option:'C',userid:userid,token:token,meet_link:"https://meet.google.com/"+meetid });
        //action on response
          $("#quizinjected").css({
           display: 'none'
          });
      }
      });
});
//Option D submitted as answer
$("#submitOptionD").click(function(){
  //find email meetId attendanceId
  chrome.storage.sync.get(['meetId','id','token'],function(data){
      var userid = data.id;
      var meetid = data.meetId;
      const token = data.token;
      //make post request
      if(meetid!="none"){
        chrome.runtime.sendMessage({todo:"markAnswer",option:'D',userid:userid,token:token,meet_link:"https://meet.google.com/"+meetid });
        //action on response
          $("#quizinjected").css({
           display: 'none'
          });
      }
      });
});
