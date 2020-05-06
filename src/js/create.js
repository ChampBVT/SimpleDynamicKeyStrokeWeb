(()=>{
    const dup_warn = document.getElementById('duplicate_user');
    const register = document.getElementById('register');
    const pwdInput = document.getElementById('password');
    let start;
    let stop;
    let flightStart;
    let flightStop;
    const timeMap = [];
    const flightMap = [];

    dup_warn.style.display = 'none';
    register.addEventListener('submit',
        function(e){
            e.preventDefault();
            createUser(register.username.value, register.password.value, timeMap, flightMap)
                .then((res) => {
                    console.log(res)
                    if(res.status === "created") {
                        alert("Account created!")
                        window.location = '/index.html'
                    }
                    if(res.status === "duplicate username" && dup_warn.style.display === "none"){
                        dup_warn.style.display = 'block';
                        console.log('dup_error');
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
            if(flightMap.length === 0)
                flightStart = e.timeStamp
            flightStop = e.timeStamp
            flightMap.push({
                [`${e.key}`]: flightStop - flightStart
            })
        } else if(e.keyCode === 8 || e.keyCode === 46){
            flightMap.length=0
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
            flightStart = e.timeStamp
            console.log(flightMap);
            console.log(timeMap);
        }
    }
})();