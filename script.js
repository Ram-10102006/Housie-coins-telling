// ===== Variables =====
const grid = document.getElementById('grid');
const display = document.getElementById('display');
const generateBtn = document.getElementById('generateBtn');
const autoBtn = document.getElementById('autoBtn');
const resetBtn = document.getElementById('resetBtn');
const languageSelect = document.getElementById('language');
const prevBtn = document.getElementById('prevBtn');

const prevPopup = document.getElementById('prevPopup');
const prevList = document.getElementById('prevList');
const closePrev = document.getElementById('closePrev');

const confirmPopup = document.getElementById('confirmPopup');
const yesReset = document.getElementById('yesReset');
const cancelReset = document.getElementById('cancelReset');

let numbers = Array.from({ length: 90 }, (_, i) => i + 1);
let remaining = [...numbers];
let history = [];
let autoInterval = null;

// ===== Functions =====
function createGrid(){
  grid.innerHTML = "";
  numbers.forEach(num => {
    const div = document.createElement('div');
    div.classList.add('number');
    div.textContent = num;
    grid.appendChild(div);
  });
}
createGrid();
let allButtons = document.querySelectorAll('.number');

function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
shuffle(remaining);

const teluguMap = {
  1:"ఒకటి",2:"రెండు",3:"మూడు",4:"నాలుగు",5:"ఐదు",6:"ఆరు",7:"ఏడు",8:"ఎనిమిది",9:"తొమ్మిది",10:"పది",
  11:"పదకొండు",12:"పన్నెండు",13:"పదమూడు",14:"పద్నాలుగు",15:"పదిహేను",16:"పదహారు",17:"పదిహేడు",
  18:"పద్దెనిమిది",19:"పందొమ్మిది",20:"ఇరవై",30:"ముప్పై",40:"నలభై",50:"యాభై",60:"అరవై",70:"డెబ్బై",80:"ఎనభై",90:"తొంభై"
};

function numberToTelugu(num){
  if(teluguMap[num]) return teluguMap[num];
  if(num<100){
    let tens = Math.floor(num/10)*10;
    let ones = num%10;
    return (teluguMap[tens]||'')+' '+(teluguMap[ones]||'');
  }
  return num.toString();
}

function speakNumber(num){
  const lang = languageSelect.value;
  const utter = new SpeechSynthesisUtterance();
  utter.rate = 0.9;
  utter.lang = (lang==='en')?'en-IN':'te-IN';
  utter.text = (lang==='en')?num.toString():numberToTelugu(num);
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

function generateNumber(){
  if(remaining.length===0){
    display.textContent="END";
    speakNumber("Game over");
    clearInterval(autoInterval); autoInterval=null;
    autoBtn.classList.remove('active'); autoBtn.textContent="Start Auto Generate";
    return;
  }
  const num = remaining.pop();
  display.textContent=num;
  allButtons[num-1].classList.add('drawn');
  speakNumber(num);
  history.push(num);
}

// ===== Event Listeners =====
generateBtn.addEventListener('click', generateNumber);

autoBtn.addEventListener('click', ()=>{
  if(autoInterval){
    clearInterval(autoInterval); autoInterval=null;
    autoBtn.classList.remove('active'); autoBtn.textContent="Start Auto Generate";
  } else{
    autoBtn.classList.add('active'); autoBtn.textContent="Stop Auto Generate";
    generateNumber();
    autoInterval=setInterval(generateNumber,4000);
  }
});

// ===== Previous Numbers Popup =====
prevBtn.addEventListener('click', ()=>{
  if(history.length===0){ 
    prevList.innerHTML="No numbers yet."; 
  } else { 
    prevList.innerHTML = history.map((n,i)=>`<div>${i+1}) ${n}</div>`).join(""); 
  }
  prevPopup.style.display="flex";
});
closePrev.addEventListener('click', ()=>{ prevPopup.style.display="none"; });
prevPopup.addEventListener('click', e=>{ if(e.target===prevPopup) prevPopup.style.display="none"; });

// ===== Reset Confirmation =====
resetBtn.addEventListener('click', ()=>{ confirmPopup.style.display="flex"; });
cancelReset.addEventListener('click', ()=>{ confirmPopup.style.display="none"; });
yesReset.addEventListener('click', ()=>{
  confirmPopup.style.display="none";
  clearInterval(autoInterval); autoInterval=null;
  autoBtn.classList.remove('active'); autoBtn.textContent="Start Auto Generate";
  display.textContent="--"; history=[]; 
  remaining=[...numbers];
  shuffle(remaining); // ✅ shuffle numbers after reset
  createGrid(); allButtons=document.querySelectorAll('.number');
  speechSynthesis.cancel();
});