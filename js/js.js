        let canvas = document.querySelector('#canvas');
        let ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth - 20;
        canvas.height = window.innerHeight- 20;

        //변수정의
        let animation;
        let timer = 0;
        let air = false;
        let jump = false;
        let jumptimer = 0;
        let down = false;
        let btn = document.querySelector('button');
        let main = document.querySelector('#startBtn');
        let score = 0;
        let speed = 5;
        let moonspeed = 1600;
        let builspeed = 100;
        let lightY = 760;
        let fogspeed = 1500;
        let leftnum = 0;
        let reGame = document.querySelector('#reGame');
        let scored = document.querySelector('#score');
        let SSscore = 0;


        //주인공 이미지
        let PSSImg = new Image();
        PSSImg.src = "img/성수머리.png";

        //장애물이미지 노드리스트
        let obsImgs = document.querySelectorAll('#huddle img');

        //달
        let moonImg = document.querySelector('#moon img');

        //안개
        let fogImg = document.querySelector('#fog img');

        //라이트
        let lightImg = document.querySelector('#light img');

        //주인공 이미지 만들기
        let gameU = {
            x : 30,
            y : 700,
            width : 190,
            height : 150,
            draw(){
                ctx.drawImage(PSSImg, this.x, this.y, this.width, this.height);
            }
        }
        //주인공의 실제 판정
        let realU = {
            x : 210,
            y : 700,
            width : 5,
            height : 100,
            draw(){
                ctx.fillStyle = "rgba(0,0,0,0)";
                ctx.fillRect(this.x , this.y, this.width, this.height);
            }
        }
        //앉았을 때 돌에 걸리게 하는 판정
        let downU = {
            x : 210,
            y : 500,
            width : 5,
            height : 100,
            draw(){
                ctx.fillStyle = "rgba(0,0,0,0)";
                ctx.fillRect(this.x , this.y, this.width, this.height);
            }
        }
        // 장애물 배열 생성
        let obstacleArr = [];
        // 장애물 만들기 틀 생성
        class obstacle {
            constructor(){
                //num은 0, 1, 2 랜덤 값 도출
                this.num = Math.floor(Math.random()*7);

                this.x = 1700;
                this.y = this.num >= 5 ? 700 : 800;
                this.width = 50;
                this.height = 50;

               
            }
            draw(){
                ctx.drawImage(obsImgs[this.num], this.x, this.y, this.width, this.height);
            }
        }
        //점수
        function text(){
            ctx.fillStyle = "palegreen";
            ctx.font = "normal bold 24px sans-serif" ;
            ctx.fillText("SCORE : ", 100, 100)
        }
        function text2(){
            ctx.fillStyle = "palegreen";
            ctx.font = "normal bold 24px sans-serif" ;
            ctx.fillText(SSscore, 200, 100)
        }
        //달
        function moon(){
            ctx.drawImage(moonImg, moonspeed, 100, 100, 100);
        }
        moon();
        //구름
        function fog(){
            ctx.drawImage(fogImg, fogspeed, 150, 1000, 100);
        }
        fog();
        //전조등
        function light(){
            ctx.drawImage(lightImg, 220, lightY, 130, 70);
        }
        light();

        //화면을 계속해서 진행하는 함수
        //애니메이션 만들기
        //1초에 60번 실행
        //장애물은 2~3초에 하나씩 생성
        function startFrame(){

            animation = requestAnimationFrame(startFrame); //1초에 60번 이 함수를 반복한다
            timer ++;

            // 프레임마다 캔버스 지우기
            ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

            //timer가 180 증가할 때마다 장애물 배열에 장애물 생성
            //장애물 배열에 넣기
            if(timer % 180 === 0){              // 1초에 타이머가 60 올라간다
                let obs = new obstacle;         // 즉 3초가 지나 타이머가 180이 됐을 때
                obstacleArr.push(obs);          // 새로운 객체를 만들어 배열에 푸쉬한다
            }

            obstacleArr.forEach((item, index, arr)=> {
                //왼쪽으로 이동된 장애물 제거하기
                //x좌표가 0보다 작으면 배열에서 제거
                if(item.x < 0){
                    arr.splice(index, 1);       //splice(시작, 몇번째);
                    score ++;
                    SSscore += 30;
                }

                // 프레임마다 x를 감소시키고(왼쪽으로 이동)
                // 새로 그려준다
                item.x -= speed;      //item의 x값 감소
                item.draw();
                //장애물을 계속 왼쪽으로 이동시키며 충돌하는지 체크
                crashCheck(realU, item);
            })
            //달 이동
            moonspeed -= 0.2;
            moon();

            //구름 이동
            fogspeed -= 0.8;
            fog();

            //전조등
            light();
            
            
            // 프레임마다 캐릭터 다시 그려주기
            gameU.draw();
            realU.draw();
            downU.draw();

            // 점프 효과
            if(jump == true){
                gameU.y -= 3;
                realU.y -= 3;
                lightY -= 3;
                jumptimer++;
            } else {
                if(gameU.y < 700){
                    gameU.y += 3;
                    realU.y += 3;
                    lightY += 3;
                }
            }
            if(jumptimer > 30){
                jump = false;
                jumptimer = 0;
            }
            if(gameU.y === 700){
                air = false;
            }
            
            // 밑 눌렀을 때 엎드리기
            if(down == true){
                gameU.height = 70;
                gameU.y = 780;
                downU.y = 780;
                realU.y = 500;

                lightY = 785;
            }
            // 점수출력
            text();
            text2();
        }
        
        //이벤트
        btn.addEventListener('click', function(){
            startFrame();
            moveBg();
            main.classList.add('on');
        })
        reGame.addEventListener('click', function(){
            obstacleArr = [];
            startFrame();
            moveBg();
            end.classList.remove('on');
            score = 0;
        })

        //키 이벤트
            window.addEventListener('keydown', function(e){
                if(e.code == "Space" && air===false){
                    down = false;
                    air = true;
                    jump = true;
                }
                if(e.code == "ArrowDown" && air == false){
                    down = true;
                }
            })
            window.addEventListener('keyup', function(e){
                if(e.code == "ArrowDown"){
                    down = false;
                    gameU.height = 150;
                    gameU.y = 700;
                    realU.height = 100;
                    realU.y = 700;
                    lightY = 760;
                    downU.y = 500;
                }
            })
        
        //충돌 확인하기

        function crashCheck(user, item){
            let x차이 = item.x - (user.x + user.width);
            let y차이 = item.y - (user.y + user.height);
            let 다운차이 = item.y - (downU.y+downU.height);
            if(x차이 == 0 && y차이 <= 0){
                cancelAnimationFrame(animation);
                console.log('충돌');
                stopBg();
                console.log("x",x차이);
                console.log("y",y차이);
                scored.innerHTML = score;
                end.classList.add('on');
            }
            if(x차이 == 0 && 다운차이 == -80){
                cancelAnimationFrame(animation);
                console.log('충돌');
                stopBg();
                console.log("x",다운차이);
                console.log("다운y",다운차이);
                scored.innerHTML = score;
                end.classList.add('on');
            }
        }

        //배경 움직이기
        const slideGroup = document.querySelector('#slideGroup');
        
        let timestop;
        function moveBg(){
            timestop = 
                setInterval(function(){   
                score += 2;
               leftnum -= 30;
               slideGroup.style.left = leftnum + 'px';
               if(leftnum <= -15000){
                cancelAnimationFrame(animation);
                stopBg();
                }
            }, 100)
            
        }
        //멈추기
        function stopBg(){
            clearInterval(timestop);
            leftnum = 0;
        }
        

