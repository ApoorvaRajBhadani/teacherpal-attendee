$(function(){
    chrome.storage.sync.get(['user','meetId','username'],function(data){
        console.log(data);
    }); 

    //Initialize Popup.html
    chrome.storage.sync.get(['id','username'],function(userinfo){
        if(userinfo.id && userinfo.id != "none"){
            //user is signed in
            $("#btnSignIn").css('display','none');
            $("#email").css('display','none');
            $("#pass").css('display','none');
            $("#userinfo").text("Logged in as "+userinfo.username);
        }else{
            //user is not signed in
            $("#btnSignOut").css('display','none');
            $("#userinfo").css('display','none');
        }
    });

    //Sign in click listener
    $("#btnSignIn").click(function(){
        //console.log(token);
        var email = $("#email").val();
        var pass = $("#pass").val();
        $("#email").val("");
        $("#pass").val("");
        fetch('http://localhost:8000/api/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: pass,
            }),
            headers: {
                'Content-type': 'application/json',
            },
        })
        .then(function(response){
            console.log(response.status);
            return response.json();
        })
        .then(function(json){
            console.log(json);
            if(json.id && json.role==="is_student"){
                console.log(json);
                console.log("login successful");
                const uid = json.id;
                chrome.storage.sync.set({'id':uid,'username':json.username,'token': json.token,'role': json.role},function(){

                    $("#btnSignOut").css('display','block');
                    $("#userinfo").css('display','block');
                    $("#userinfo").text("Logged in as "+json.username);
        
                    $("#btnSignIn").css('display','none');
                    $("#email").css('display','none');
                    $("#pass").css('display','none');
                });
            }else{
                console.log(json);
                console.log("login failed");
                // close();
            }
        });
    });

    //Sign Out click listener
    $("#btnSignOut").click(function(){
        chrome.storage.sync.set({'id':"none",'username':"none",'token':"none",'role':"none"},function(){

            $("#btnSignOut").css('display','none');
            $("#btnTakeAttendance").css('display','none');
            $("#userinfo").css('display','none');

            $("#btnSignIn").css('display','block');
            $("#email").css('display','block');
            $("#pass").css('display','block');
        });
    });
});