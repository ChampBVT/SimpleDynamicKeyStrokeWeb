(()=>{
    const result = document.getElementById('result');
    const login = document.getElementById('login');
    const pwdInput = document.getElementById('password');
    let start2;
    let stop2;
    const timeMap = [];

    login.addEventListener('submit',
        function(e){
            e.preventDefault();
            postLogin(login.username.value, login.password.value, timeMap)
                .then((res) => {
                    const ids = [...document.querySelectorAll("#result [id]")];
                    if(res.status === "authenticated") {
                        ids[0].innerText = "Welcome!"
                        ids[0].style.color = "green"
                        ids[1].innerText = 'Username : '+res.username
                        ids[2].innerText = 'Euclidean Distance : '+res.distance
                        ids[3].innerText = 'Cosine Similarity : '+res.cosine
                        login.style.display = "none"
                        result.style.display = "flex"
                    }
                    if(res.status === "unauthenticated") {
                        ids[0].innerText = "Hmm..., \nIt seems like you're not genuine."
                        ids[0].style.color = "#F9A825"
                        ids[1].innerText = 'Username : '+res.username
                        ids[2].innerText = 'Euclidean Distance : '+res.distance
                        ids[3].innerText = 'Cosine Similarity : '+res.cosine
                        login.style.display = "none"
                        result.style.display = "flex"
                    }
                    timeMap.length=0
                    login.username.value="a"
                    login.password.value=""
                });
        })

    pwdInput.addEventListener('keydown', logKeyStart);
    pwdInput.addEventListener('keyup', logKeyStop);

    function logKeyStart(e) {
        if((e.keyCode>=48 && e.keyCode<=90)||(e.keyCode>=96 && e.keyCode<=111)||(e.keyCode>=186 && e.keyCode<=222)) {
            start2 = e.timeStamp
        } else if(e.keyCode === 8 || e.keyCode === 46){
            timeMap.length=0
            login.username.value="a"
            login.password.value=""
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