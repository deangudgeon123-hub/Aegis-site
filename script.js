// Small sparkline filler
['spark1','spark2','spark3'].forEach(id=>{
  const c=document.getElementById(id),ctx=c.getContext('2d');
  ctx.strokeStyle='rgba(255,180,90,0.6)';ctx.lineWidth=2;
  ctx.beginPath();for(let x=0;x<=200;x+=20){ctx.lineTo(x,Math.random()*30+20);}ctx.stroke();
});

// Wallet modal + local mock connection
const overlay=document.getElementById('overlay');
const connectBtn=document.getElementById('connectBtn');
const closeModal=document.getElementById('closeModal');
const learnMore=document.getElementById('learnMore');

const state=(()=>{try{return JSON.parse(localStorage.getItem('aegis-ui'))||{};}catch{return{};}})();

function openModal(){overlay.classList.add('show');}
function close(){overlay.classList.remove('show');}
connectBtn.addEventListener('click',openModal);
closeModal.addEventListener('click',close);
overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
learnMore.addEventListener('click',()=>alert('Wallets let you sign blockchain transactions. You’ll hook your real smart contract later.'));

document.querySelectorAll('.wbtn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const name=btn.dataset.wallet;
    const address='0x0754…36037';
    state.wallet={name,address};
    localStorage.setItem('aegis-ui',JSON.stringify(state));
    connectBtn.classList.add('connected');
    connectBtn.textContent=`🟢 Connected: ${address}`;
    close();
  });
});
if(state.wallet){
  connectBtn.classList.add('connected');
  connectBtn.textContent=`🟢 Connected: ${state.wallet.address}`;
}
