(()=>{

    const register = document.getElementById('register');
    const pwdInput = document.getElementById('password');
    let start;
    let stop;
    const timeMap = [];

    register.addEventListener('submit',
        function(e){
            e.preventDefault();
            createUser(register.username.value, register.password.value, timeMap)
                .then((res) => {
                    console.log(res)
                    if(res.status === "created") {
                        window.location = '/index.html'
                    }
                    timeMap.length=0
                    register.username.value=""
                    register.password.value=""
                });
        })

    pwdInput.addEventListener('keydown', logKeyStart);
    pwdInput.addEventListener('keyup', logKeyStop);

    function logKeyStart(e) {
        if((e.keyCode>=48 && e.keyCode<=90)||(e.keyCode>=96 && e.keyCode<=111)||(e.keyCode>=186 && e.keyCode<=222)) {
            start = e.timeStamp
        } else if(e.keyCode === 8 || e.keyCode === 46){
            timeMap.length=0
            register.username.value=""
            register.password.value=""
        }
    }

    function logKeyStop(e) {
        if((e.keyCode>=48 && e.keyCode<=90)||(e.keyCode>=96 && e.keyCode<=111)||(e.keyCode>=186 && e.keyCode<=222)) {
            stop = e.timeStamp
            timeMap.push({
                [`${e.key}`]: stop - start
            })
            console.log(timeMap);
        }
    }
})();