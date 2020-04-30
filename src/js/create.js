(()=>{

    const register = document.getElementById('register');
    const pwdInput = document.getElementById('password');
    let start2;
    let stop2;
    const timeMap = [];

    register.addEventListener('submit',
        function(e){
            e.preventDefault();
            createUser(register.username.value, register.password.value, timeMap)
                .then((res) => {
                    if(res.status === "created") {
                        //alert("Account created")
                        window.location = '/index.html'

                    }
                    timeMap.length=0
                    register.username.value=""
                    register.password.value=""
                });
            console.log(register.username.value)
            console.log(register.password.value)

        })

    pwdInput.addEventListener('keydown', logKeyStart);
    pwdInput.addEventListener('keyup', logKeyStop);

    function logKeyStart(e) {
        if((e.keyCode>=48 && e.keyCode<=90)||(e.keyCode>=96 && e.keyCode<=111)||(e.keyCode>=186 && e.keyCode<=222)) {
            start2 = e.timeStamp
        } else if(e.keyCode === 8 || e.keyCode === 46){
            timeMap.length=0
            register.username.value=""
            register.password.value=""
        }
    }

    function logKeyStop(e) {
        if((e.keyCode>=48 && e.keyCode<=90)||(e.keyCode>=96 && e.keyCode<=111)||(e.keyCode>=186 && e.keyCode<=222)) {
            stop2 = e.timeStamp
            timeMap.push({
                [`${e.key}`]: stop2 - start2
            })
            console.log(timeMap);
        }
    }
})();