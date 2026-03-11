import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─── */
const T = {
  ink:       "#0F1A0A",
  forest:    "#1B3A0F",
  pine:      "#2D5A1B",
  sage:      "#6B9E4A",
  mist:      "#C8DDB2",
  cream:     "#F7F3EC",
  parchment: "#EDE7D9",
  yolk:      "#F0A500",
  ember:     "#D45D1E",
  sky:       "#4A8FA8",
  blush:     "#F5EDE3",
  white:     "#FFFFFF",
  gray1:     "#8A8478",
  gray2:     "#C4BEB4",
  card:      "#FFFCF7",
};

const font = {
  display: "'Cormorant Garamond', 'Georgia', serif",
  body:    "'Outfit', 'system-ui', sans-serif",
};

/* ─── DATA ─── */
const PRODUCTS = [
  { id:1, name:"Just Egg Liquid",      cat:"Plant Egg",    price:6.99,  unit:"12oz",  co2:"0.1kg",  emoji:"🥚", badge:"Best Seller", protein:"5g",  rating:4.9, desc:"Pourable plant-based egg, perfect for scrambles & omelettes." },
  { id:2, name:"Just Egg Folded",      cat:"Plant Egg",    price:5.49,  unit:"4 ct",  co2:"0.08kg", emoji:"🍳", badge:"Quick Cook",   protein:"5g",  rating:4.8, desc:"Pre-folded plant egg patties, ready in 90 seconds." },
  { id:3, name:"Beyond Beef Mince",    cat:"Alt Meat",     price:9.99,  unit:"16oz",  co2:"2.1kg",  emoji:"🥩", badge:"Top Pick",     protein:"20g", rating:4.7, desc:"Juicy plant-based ground beef — grills, sautés, crumbles." },
  { id:4, name:"Impossible Burger",    cat:"Alt Meat",     price:8.49,  unit:"12oz",  co2:"1.9kg",  emoji:"🍔", badge:"Fan Fave",     protein:"19g", rating:4.8, desc:"The burger that bleeds. 100% plant, 0% compromise." },
  { id:5, name:"Lentil Protein Blend", cat:"Plant Protein",price:14.99, unit:"1lb",   co2:"0.3kg",  emoji:"🫘", badge:"Eco Star",     protein:"24g", rating:4.6, desc:"High-protein lentil powder, neutral taste, mixes into anything." },
  { id:6, name:"Tempeh Strips",        cat:"Plant Protein",price:4.99,  unit:"8oz",   co2:"0.2kg",  emoji:"🌿", badge:"Fermented",    protein:"16g", rating:4.7, desc:"Smoky marinated tempeh, packed with probiotics & protein." },
  { id:7, name:"Pea Protein Isolate",  cat:"Plant Protein",price:24.99, unit:"2lb",   co2:"0.4kg",  emoji:"💪", badge:"Clean Label",  protein:"27g", rating:4.9, desc:"Pure pea protein isolate, 27g per serving, unflavoured." },
  { id:8, name:"Oat-Based Sausage",    cat:"Alt Meat",     price:6.49,  unit:"6 ct",  co2:"0.5kg",  emoji:"🌭", badge:"Breakfast",    protein:"12g", rating:4.5, desc:"Crispy oat & herb sausages, no cholesterol, big flavour." },
];

const RECIPES = [
  { id:1, name:"Golden Scramble Bowl",    time:"8 min",  diff:"Easy",  co2save:"92%", emoji:"🥣", tag:"Breakfast", kcal:210, protein:"12g", products:[1] },
  { id:2, name:"Beyond Bolognese",        time:"25 min", diff:"Med",   co2save:"80%", emoji:"🍝", tag:"Dinner",    kcal:420, protein:"28g", products:[3] },
  { id:3, name:"Impossible Smash Burger", time:"18 min", diff:"Med",   co2save:"75%", emoji:"🍔", tag:"Lunch",     kcal:490, protein:"30g", products:[4] },
  { id:4, name:"Turmeric Frittata",       time:"20 min", diff:"Easy",  co2save:"95%", emoji:"🟡", tag:"Brunch",    kcal:230, protein:"14g", products:[1,2] },
  { id:5, name:"Tempeh Power Bowl",       time:"12 min", diff:"Easy",  co2save:"88%", emoji:"🥗", tag:"Lunch",     kcal:340, protein:"22g", products:[6] },
  { id:6, name:"Pea Protein Pancakes",    time:"15 min", diff:"Easy",  co2save:"90%", emoji:"🥞", tag:"Breakfast", kcal:280, protein:"18g", products:[7] },
];

const ECO = [
  { icon:"🌿", label:"CO₂ Saved",    value:"52.4kg",  color:T.pine },
  { icon:"💧", label:"Water Saved",  value:"2,140L",  color:T.sky  },
  { icon:"🍳", label:"Meals Cooked", value:"148",     color:T.yolk },
  { icon:"🔥", label:"Day Streak",   value:"24",      color:T.ember},
];

const CATS = ["All","Plant Egg","Alt Meat","Plant Protein"];

/* ─── HELPERS ─── */
const Badge = ({text, color=T.pine}) => (
  <span style={{background:`${color}18`,color,fontFamily:font.body,fontSize:"9px",fontWeight:700,
    letterSpacing:"0.8px",textTransform:"uppercase",padding:"3px 8px",borderRadius:"20px",border:`1px solid ${color}30`}}>
    {text}
  </span>
);

const GreenTag = ({text}) => (
  <span style={{background:T.mist,color:T.forest,fontFamily:font.body,fontSize:"9px",fontWeight:700,
    padding:"3px 8px",borderRadius:"10px"}}>🌿 {text}</span>
);

const Pill = ({text, active, onClick}) => (
  <button onClick={onClick} style={{
    padding:"8px 16px",borderRadius:"20px",border:"none",cursor:"pointer",
    background: active ? T.pine : T.white,
    color: active ? T.white : T.gray1,
    fontFamily:font.body,fontSize:"12px",fontWeight:600,
    boxShadow:"0 2px 8px rgba(0,0,0,0.07)",
    transition:"all 0.2s",whiteSpace:"nowrap",
  }}>{text}</button>
);

/* ─── LAYOUT SHELLS ─── */
const StatusBar = () => (
  <div style={{background:T.ink,color:"rgba(247,243,236,0.85)",padding:"9px 20px",
    display:"flex",justifyContent:"space-between",fontSize:"11px",fontFamily:font.body,fontWeight:600}}>
    <span>9:41 AM</span><span>●●●●  ᯤ  🔋</span>
  </div>
);

const BottomNav = ({active, set}) => {
  const items = [{id:"home",icon:"🏠",lbl:"Home"},{id:"shop",icon:"🛒",lbl:"Shop"},
    {id:"scanner",icon:"📷",lbl:"Scan"},{id:"ai",icon:"🤖",lbl:"AI Chef"},{id:"profile",icon:"🌍",lbl:"Profile"}];
  return (
    <div style={{background:T.white,borderTop:"1px solid #EDE9E0",display:"flex",
      padding:"8px 0 13px",boxShadow:"0 -4px 24px rgba(0,0,0,0.06)"}}>
      {items.map(it=>(
        <button key={it.id} onClick={()=>set(it.id)} style={{
          flex:1,background:"none",border:"none",cursor:"pointer",
          display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",padding:"4px 0"}}>
          <span style={{fontSize:it.id==="scanner"?"24px":"19px",
            filter:active===it.id?"none":"grayscale(0.6) opacity(0.45)",transition:"all 0.2s"}}>{it.icon}</span>
          <span style={{fontSize:"9px",fontFamily:font.body,fontWeight:700,
            color:active===it.id?T.yolk:T.gray1,textTransform:"uppercase",letterSpacing:"0.6px"}}>{it.lbl}</span>
        </button>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════
   SCREEN: SPLASH
══════════════════════════════════════════ */
const Splash = ({onDone}) => {
  useEffect(()=>{const t=setTimeout(onDone,2400);return()=>clearTimeout(t);},[]);
  return (
    <div style={{flex:1,background:`linear-gradient(150deg,${T.ink} 0%,${T.forest} 55%,#3A6B20 100%)`,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,position:"relative",overflow:"hidden"}}>
      {/* decorative circles */}
      {[180,280,380].map((s,i)=>(
        <div key={i} style={{position:"absolute",width:s,height:s,borderRadius:"50%",
          border:`1px solid rgba(200,221,178,${0.08-i*0.02})`,
          top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>
      ))}
      <div style={{width:96,height:96,borderRadius:"28px",
        background:"rgba(240,165,0,0.12)",border:"1.5px solid rgba(240,165,0,0.3)",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,
        animation:"bob 2s ease-in-out infinite"}}>🥚</div>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:font.display,fontSize:32,fontWeight:700,
          color:T.cream,letterSpacing:"-0.5px",lineHeight:1}}>Just Egg</div>
        <div style={{fontFamily:font.body,fontSize:11,color:"rgba(200,221,178,0.7)",
          letterSpacing:"5px",textTransform:"uppercase",marginTop:4}}>Smart Kitchen</div>
      </div>
      <div style={{marginTop:20,width:56,height:3,borderRadius:2,background:"rgba(255,255,255,0.12)",overflow:"hidden"}}>
        <div style={{height:"100%",background:T.yolk,borderRadius:2,animation:"loadbar 2.2s ease-out forwards"}}/>
      </div>
      <style>{`
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes loadbar{0%{width:0}100%{width:100%}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scanline{0%,100%{top:8%}50%{top:84%}}
        @keyframes ping{0%{transform:scale(1);opacity:0.8}100%{transform:scale(1.8);opacity:0}}
      `}</style>
    </div>
  );
};

/* ══════════════════════════════════════════
   SCREEN: ONBOARDING
══════════════════════════════════════════ */
const Onboarding = ({onDone}) => {
  const [step,setStep]=useState(0);
  const steps=[
    {emoji:"🌱",col:T.pine,   title:"Eat Smarter, Live Greener",    sub:"Discover plant-based eggs, proteins & meat alternatives that slash your carbon footprint."},
    {emoji:"🛒",col:T.yolk,   title:"Shop & Cook in One Place",      sub:"Buy Just Egg, Beyond Beef, pea protein and more — then cook them with AI-curated recipes."},
    {emoji:"🤖",col:T.sky,    title:"Your AI Kitchen Assistant",     sub:"Scan your fridge, chat with our Chef AI, and track your real-world sustainability impact."},
  ];
  const s=steps[step];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",background:T.cream}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",padding:"32px 28px",gap:28,animation:"fadeUp 0.4s ease-out"}}>
        <div style={{width:128,height:128,borderRadius:"40px",
          background:`${s.col}12`,border:`2px solid ${s.col}25`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:64}}>{s.emoji}</div>
        <div style={{textAlign:"center"}}>
          <h1 style={{fontFamily:font.display,fontSize:28,fontWeight:700,
            color:T.ink,margin:"0 0 14px",lineHeight:1.15}}>{s.title}</h1>
          <p style={{fontFamily:font.body,fontSize:14,color:T.gray1,lineHeight:1.65,margin:0}}>{s.sub}</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          {steps.map((_,i)=>(
            <div key={i} style={{width:i===step?28:8,height:8,borderRadius:4,
              background:i===step?s.col:T.gray2,transition:"all 0.3s"}}/>
          ))}
        </div>
      </div>
      <div style={{padding:"16px 28px 36px",display:"flex",gap:12}}>
        {step>0&&<button onClick={()=>setStep(step-1)} style={{
          flex:1,padding:16,borderRadius:16,border:`1.5px solid ${T.mist}`,
          background:"transparent",fontFamily:font.body,fontWeight:700,fontSize:14,
          color:T.gray1,cursor:"pointer"}}>Back</button>}
        <button onClick={()=>step<2?setStep(step+1):onDone()} style={{
          flex:2,padding:16,borderRadius:16,border:"none",
          background:`linear-gradient(135deg,${T.pine},${T.sage})`,
          fontFamily:font.body,fontWeight:700,fontSize:15,color:T.white,cursor:"pointer",
          boxShadow:"0 6px 20px rgba(45,90,27,0.35)"}}>
          {step===2?"Let's Cook 🌱":"Continue"}
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   SCREEN: HOME
══════════════════════════════════════════ */
const Home = ({setTab}) => (
  <div style={{flex:1,overflow:"auto",background:T.cream}}>
    {/* Hero header */}
    <div style={{background:`linear-gradient(160deg,${T.ink} 0%,${T.forest} 60%,${T.pine} 100%)`,
      padding:"22px 20px 36px",borderRadius:"0 0 32px 32px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",right:-20,top:-20,width:140,height:140,borderRadius:"50%",
        background:"rgba(240,165,0,0.07)",pointerEvents:"none"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div>
          <p style={{fontFamily:font.body,fontSize:11,color:"rgba(200,221,178,0.65)",margin:0,
            textTransform:"uppercase",letterSpacing:"1.5px"}}>Welcome back</p>
          <h2 style={{fontFamily:font.display,fontSize:26,fontWeight:700,
            color:T.cream,margin:"3px 0 0",lineHeight:1}}>Alex 🌱</h2>
        </div>
        <div style={{width:44,height:44,borderRadius:14,
          background:"rgba(247,243,236,0.1)",border:"1.5px solid rgba(247,243,236,0.2)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>👤</div>
      </div>
      {/* Impact card */}
      <div style={{background:"rgba(247,243,236,0.1)",backdropFilter:"blur(8px)",
        borderRadius:20,padding:"16px 18px",border:"1px solid rgba(247,243,236,0.12)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <p style={{fontFamily:font.body,fontSize:10,color:"rgba(200,221,178,0.65)",
              margin:0,textTransform:"uppercase",letterSpacing:"1px"}}>This Week's CO₂ Saved</p>
            <p style={{fontFamily:font.display,fontSize:30,color:T.yolk,
              fontWeight:700,margin:"5px 0 0",lineHeight:1}}>5.2kg</p>
            <p style={{fontFamily:font.body,fontSize:11,
              color:"rgba(200,221,178,0.6)",margin:"4px 0 0"}}>vs conventional animal products</p>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:40}}>🏆</div>
            <p style={{fontFamily:font.body,fontSize:9,color:T.mist,
              margin:"5px 0 0",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Eco Champ</p>
          </div>
        </div>
      </div>
    </div>

    <div style={{padding:20}}>
      {/* Quick stats */}
      <div style={{display:"flex",gap:10,marginBottom:26}}>
        {[["🔥","24 days","Streak"],["⭐","1,480","Points"],["🛒","$34","Saved"]].map(([ic,v,l])=>(
          <div key={l} style={{flex:1,background:T.white,borderRadius:16,padding:"12px 8px",
            textAlign:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
            <div style={{fontSize:20}}>{ic}</div>
            <div style={{fontFamily:font.display,fontSize:18,fontWeight:700,color:T.ink,lineHeight:1.1}}>{v}</div>
            <div style={{fontFamily:font.body,fontSize:"9px",color:T.gray1,
              textTransform:"uppercase",letterSpacing:"0.5px",marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Shop shortcut */}
      <div onClick={()=>setTab("shop")} style={{
        background:`linear-gradient(130deg,${T.yolk} 0%,${T.ember} 100%)`,
        borderRadius:20,padding:"16px 20px",marginBottom:26,cursor:"pointer",
        display:"flex",justifyContent:"space-between",alignItems:"center",
        boxShadow:"0 6px 20px rgba(212,93,30,0.3)"}}>
        <div>
          <p style={{fontFamily:font.body,fontSize:10,color:"rgba(255,255,255,0.75)",
            margin:0,textTransform:"uppercase",letterSpacing:"1px"}}>New Arrivals</p>
          <p style={{fontFamily:font.display,fontSize:20,color:T.white,
            fontWeight:700,margin:"4px 0 6px",lineHeight:1.1}}>Shop Plant-Based</p>
          <p style={{fontFamily:font.body,fontSize:12,color:"rgba(255,255,255,0.8)",margin:0}}>
            Eggs · Proteins · Meat Alts →</p>
        </div>
        <div style={{fontSize:48}}>🥚</div>
      </div>

      {/* Today's recipes */}
      <div style={{marginBottom:26}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h3 style={{fontFamily:font.display,fontSize:20,fontWeight:700,color:T.ink,margin:0}}>Today's Picks</h3>
          <span style={{fontFamily:font.body,fontSize:12,color:T.yolk,fontWeight:600}}>See all →</span>
        </div>
        <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:4}}>
          {RECIPES.slice(0,4).map(r=>(
            <div key={r.id} style={{minWidth:158,background:T.white,borderRadius:20,
              padding:14,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",flexShrink:0}}>
              <div style={{fontSize:36,marginBottom:8}}>{r.emoji}</div>
              <div style={{fontFamily:font.body,fontSize:13,fontWeight:700,
                color:T.ink,marginBottom:4,lineHeight:1.3}}>{r.name}</div>
              <div style={{fontFamily:font.body,fontSize:11,color:T.gray1,marginBottom:8}}>
                {r.time} · {r.protein} protein</div>
              <GreenTag text={`${r.co2save} less CO₂`}/>
            </div>
          ))}
        </div>
      </div>

      {/* Eco tip */}
      <div style={{background:T.blush,borderRadius:18,padding:16,
        border:`1px solid ${T.ember}20`,display:"flex",gap:12,alignItems:"center"}}>
        <span style={{fontSize:28}}>💡</span>
        <div>
          <p style={{fontFamily:font.body,fontSize:10,fontWeight:700,
            color:T.ember,margin:0,textTransform:"uppercase",letterSpacing:"0.5px"}}>Did You Know?</p>
          <p style={{fontFamily:font.body,fontSize:13,color:T.ink,margin:"4px 0 0",lineHeight:1.5}}>
            Swapping one beef meal for Just Egg saves the equivalent of a 30-mile car journey in CO₂.</p>
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   SCREEN: SHOP
══════════════════════════════════════════ */
const Shop = () => {
  const [cat,setCat]=useState("All");
  const [cart,setCart]=useState({});
  const [detail,setDetail]=useState(null);

  const filtered=PRODUCTS.filter(p=>cat==="All"||p.cat===cat);
  const cartCount=Object.values(cart).reduce((a,b)=>a+b,0);
  const cartTotal=Object.entries(cart).reduce((sum,[id,qty])=>{
    const p=PRODUCTS.find(x=>x.id===+id);
    return sum+(p?p.price*qty:0);
  },0);

  const add=(id)=>setCart(c=>({...c,[id]:(c[id]||0)+1}));
  const remove=(id)=>setCart(c=>{const n={...c};if(n[id]>1)n[id]--;else delete n[id];return n;});

  if(detail){
    const p=detail;
    return(
      <div style={{flex:1,display:"flex",flexDirection:"column",background:T.cream,overflow:"auto"}}>
        <div style={{background:`linear-gradient(160deg,${T.forest},${T.pine})`,
          padding:"20px 20px 40px",position:"relative"}}>
          <button onClick={()=>setDetail(null)} style={{
            background:"rgba(247,243,236,0.15)",border:"none",borderRadius:12,
            padding:"8px 14px",fontFamily:font.body,fontSize:13,color:T.cream,cursor:"pointer",marginBottom:16}}>← Back</button>
          <div style={{fontSize:72,textAlign:"center",marginBottom:12}}>{p.emoji}</div>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
            <Badge text={p.badge} color={T.yolk}/>
            <Badge text={p.cat} color={T.mist}/>
          </div>
        </div>
        <div style={{padding:20,marginTop:-16}}>
          <div style={{background:T.white,borderRadius:24,padding:20,
            boxShadow:"0 4px 20px rgba(0,0,0,0.07)",marginBottom:16}}>
            <h2 style={{fontFamily:font.display,fontSize:24,fontWeight:700,color:T.ink,margin:"0 0 4px"}}>{p.name}</h2>
            <p style={{fontFamily:font.body,fontSize:13,color:T.gray1,margin:"0 0 14px"}}>{p.unit}</p>
            <p style={{fontFamily:font.body,fontSize:14,color:T.ink,lineHeight:1.6,margin:"0 0 16px"}}>{p.desc}</p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
              <GreenTag text={`${p.co2} CO₂/serving`}/>
              <span style={{background:`${T.sky}15`,color:T.sky,fontFamily:font.body,
                fontSize:"9px",fontWeight:700,padding:"3px 8px",borderRadius:10}}>💪 {p.protein} protein</span>
              <span style={{background:`${T.yolk}15`,color:T.ember,fontFamily:font.body,
                fontSize:"9px",fontWeight:700,padding:"3px 8px",borderRadius:10}}>⭐ {p.rating}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontFamily:font.display,fontSize:28,fontWeight:700,color:T.pine}}>
                ${p.price.toFixed(2)}</div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                {cart[p.id]?(
                  <div style={{display:"flex",alignItems:"center",gap:12,background:T.parchment,
                    borderRadius:14,padding:"8px 14px"}}>
                    <button onClick={()=>remove(p.id)} style={{background:T.gray2,border:"none",
                      width:26,height:26,borderRadius:"50%",fontSize:16,cursor:"pointer",
                      display:"flex",alignItems:"center",justifyContent:"center",color:T.ink}}>−</button>
                    <span style={{fontFamily:font.body,fontWeight:700,fontSize:16,color:T.ink,minWidth:20,textAlign:"center"}}>{cart[p.id]}</span>
                    <button onClick={()=>add(p.id)} style={{background:T.pine,border:"none",
                      width:26,height:26,borderRadius:"50%",fontSize:16,cursor:"pointer",
                      display:"flex",alignItems:"center",justifyContent:"center",color:T.white}}>+</button>
                  </div>
                ):(
                  <button onClick={()=>add(p.id)} style={{
                    padding:"12px 24px",borderRadius:14,border:"none",
                    background:`linear-gradient(135deg,${T.pine},${T.sage})`,
                    fontFamily:font.body,fontWeight:700,fontSize:14,color:T.white,cursor:"pointer",
                    boxShadow:"0 4px 14px rgba(45,90,27,0.3)"}}>Add to Cart</button>
                )}
              </div>
            </div>
          </div>
          {/* Related recipes */}
          <h3 style={{fontFamily:font.display,fontSize:18,fontWeight:700,color:T.ink,margin:"0 0 12px"}}>Cook With It</h3>
          {RECIPES.filter(r=>r.products.includes(p.id)).map(r=>(
            <div key={r.id} style={{background:T.white,borderRadius:16,padding:14,
              marginBottom:8,display:"flex",gap:12,alignItems:"center",
              boxShadow:"0 2px 10px rgba(0,0,0,0.05)"}}>
              <span style={{fontSize:30}}>{r.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:font.body,fontSize:13,fontWeight:700,color:T.ink}}>{r.name}</div>
                <div style={{fontFamily:font.body,fontSize:11,color:T.gray1,margin:"3px 0"}}>
                  {r.time} · {r.kcal} kcal · {r.protein} protein</div>
                <GreenTag text={`${r.co2save} less CO₂`}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:T.cream}}>
      {/* Header */}
      <div style={{padding:"16px 20px 0",background:T.cream}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h2 style={{fontFamily:font.display,fontSize:24,fontWeight:700,color:T.ink,margin:0}}>Sustainable Shop</h2>
          {cartCount>0&&(
            <div style={{background:T.pine,borderRadius:12,padding:"6px 14px",
              display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontFamily:font.body,fontSize:12,color:T.white,fontWeight:700}}>
                🛒 {cartCount} · ${cartTotal.toFixed(2)}</span>
            </div>
          )}
        </div>
        {/* Search bar */}
        <div style={{background:T.white,borderRadius:14,padding:"11px 16px",
          display:"flex",alignItems:"center",gap:10,
          boxShadow:"0 2px 10px rgba(0,0,0,0.05)",marginBottom:14}}>
          <span style={{fontSize:15}}>🔍</span>
          <span style={{fontFamily:font.body,fontSize:13,color:T.gray2}}>Search plant-based products…</span>
        </div>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:12}}>
          {CATS.map(c=><Pill key={c} text={c} active={cat===c} onClick={()=>setCat(c)}/>)}
        </div>
      </div>

      {/* Product grid */}
      <div style={{flex:1,overflow:"auto",padding:"0 12px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {filtered.map(p=>(
            <div key={p.id} onClick={()=>setDetail(p)} style={{
              background:T.card,borderRadius:20,padding:14,cursor:"pointer",
              boxShadow:"0 3px 14px rgba(0,0,0,0.07)",
              border:`1px solid ${T.parchment}`,position:"relative"}}>
              <div style={{position:"absolute",top:10,right:10}}>
                <Badge text={p.badge} color={p.cat==="Plant Egg"?T.yolk:p.cat==="Alt Meat"?T.ember:T.pine}/>
              </div>
              <div style={{fontSize:44,marginBottom:10,marginTop:4}}>{p.emoji}</div>
              <div style={{fontFamily:font.body,fontSize:13,fontWeight:700,
                color:T.ink,marginBottom:3,lineHeight:1.3,paddingRight:30}}>{p.name}</div>
              <div style={{fontFamily:font.body,fontSize:10,color:T.gray1,marginBottom:8}}>{p.unit}</div>
              <div style={{marginBottom:8}}>
                <GreenTag text={p.co2}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontFamily:font.display,fontSize:18,fontWeight:700,color:T.pine}}>
                  ${p.price.toFixed(2)}</span>
                <button onClick={e=>{e.stopPropagation();add(p.id);}} style={{
                  width:32,height:32,borderRadius:10,border:"none",
                  background:cart[p.id]?T.pine:`linear-gradient(135deg,${T.pine},${T.sage})`,
                  fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",
                  justifyContent:"center",color:T.white,
                  boxShadow:"0 3px 10px rgba(45,90,27,0.3)"}}>
                  {cart[p.id]?<span style={{fontSize:11,fontWeight:700}}>{cart[p.id]}</span>:"+"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   SCREEN: SCANNER
══════════════════════════════════════════ */
const Scanner = () => {
  const [phase,setPhase]=useState("idle"); // idle | scanning | done
  useEffect(()=>{
    if(phase==="scanning"){const t=setTimeout(()=>setPhase("done"),2800);return()=>clearTimeout(t);}
  },[phase]);
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:T.ink}}>
      <div style={{padding:"18px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h2 style={{fontFamily:font.display,fontSize:22,color:T.cream,margin:0,fontWeight:700}}>AI Fridge Scanner</h2>
          <p style={{fontFamily:font.body,fontSize:11,color:"rgba(200,221,178,0.6)",margin:"3px 0 0"}}>
            Scan → Get recipes → Shop what's missing</p>
        </div>
        <Badge text="AI Beta" color={T.yolk}/>
      </div>

      {/* Camera viewport */}
      <div style={{margin:"0 16px",borderRadius:24,overflow:"hidden",
        background:"#0A0F07",minHeight:260,position:"relative",
        display:"flex",alignItems:"center",justifyContent:"center",
        border:"1px solid rgba(200,221,178,0.1)"}}>
        {phase==="idle"&&(
          <div style={{textAlign:"center",padding:20}}>
            <div style={{fontSize:52,marginBottom:12}}>📷</div>
            <p style={{fontFamily:font.body,fontSize:13,color:"rgba(200,221,178,0.5)",margin:0}}>
              Point at fridge or ingredients</p>
          </div>
        )}
        {phase==="scanning"&&(
          <>
            <div style={{position:"absolute",inset:0,
              background:"linear-gradient(180deg,rgba(0,0,0,0.4) 0%,transparent 40%,transparent 60%,rgba(0,0,0,0.4) 100%)"}}/>
            {/* Corner brackets */}
            {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i)=>(
              <div key={i} style={{position:"absolute",[v]:20,[h]:20,
                width:28,height:28,
                borderTop:v==="top"?`2.5px solid ${T.yolk}`:"none",
                borderBottom:v==="bottom"?`2.5px solid ${T.yolk}`:"none",
                borderLeft:h==="left"?`2.5px solid ${T.yolk}`:"none",
                borderRight:h==="right"?`2.5px solid ${T.yolk}`:"none",
                borderRadius:h==="left"&&v==="top"?"4px 0 0 0":h==="right"&&v==="top"?"0 4px 0 0":
                  h==="left"&&v==="bottom"?"0 0 0 4px":"0 0 4px 0"}}/>
            ))}
            <div style={{position:"absolute",left:"10%",right:"10%",height:2,
              background:`linear-gradient(90deg,transparent,${T.yolk},transparent)`,
              animation:"scanline 1.8s ease-in-out infinite"}}/>
            <p style={{position:"absolute",bottom:16,fontFamily:font.body,
              fontSize:12,color:"rgba(200,221,178,0.7)"}}>Analysing ingredients…</p>
          </>
        )}
        {phase==="done"&&(
          <div style={{padding:20,textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:10}}>✅</div>
            <p style={{fontFamily:font.display,fontSize:18,color:T.cream,
              fontWeight:700,margin:"0 0 6px"}}>Scan Complete!</p>
            <p style={{fontFamily:font.body,fontSize:12,
              color:"rgba(200,221,178,0.6)",margin:0}}>Found: bell peppers · spinach · tomatoes · onions</p>
          </div>
        )}
      </div>

      {/* Results / CTA */}
      {phase==="done"?(
        <div style={{margin:"16px",background:T.cream,borderRadius:20,padding:16,flex:1}}>
          <p style={{fontFamily:font.body,fontSize:10,color:T.gray1,
            textTransform:"uppercase",letterSpacing:"1px",margin:"0 0 10px"}}>AI Recipe Suggestions</p>
          {[
            {e:"🌿",n:"Green Shakshuka",    co:"88% less CO₂",shop:"Add Just Egg →"},
            {e:"🥘",n:"Veggie Protein Bowl",co:"91% less CO₂",shop:"Add Tempeh →"},
            {e:"🍝",n:"Smoky Pepper Pasta", co:"85% less CO₂",shop:"All pantry items ✓"},
          ].map((s,i)=>(
            <div key={i} style={{padding:"12px 14px",borderRadius:14,
              background:i===2?T.mint:T.white,marginBottom:8,
              display:"flex",alignItems:"center",gap:10,
              boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
              <span style={{fontSize:28}}>{s.e}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:font.body,fontSize:13,fontWeight:700,color:T.ink}}>{s.n}</div>
                <GreenTag text={s.co}/>
              </div>
              <span style={{fontFamily:font.body,fontSize:11,color:T.pine,fontWeight:600}}>{s.shop}</span>
            </div>
          ))}
          <button onClick={()=>setPhase("idle")} style={{
            width:"100%",marginTop:8,padding:"13px",borderRadius:14,border:"none",
            background:T.parchment,fontFamily:font.body,fontWeight:700,
            fontSize:13,color:T.gray1,cursor:"pointer"}}>↺ Scan Again</button>
        </div>
      ):(
        <div style={{padding:"16px 16px 20px",display:"flex",gap:10}}>
          <button onClick={()=>setPhase("scanning")} disabled={phase==="scanning"} style={{
            flex:1,padding:16,borderRadius:16,border:"none",
            background:`linear-gradient(135deg,${T.yolk},${T.ember})`,
            fontFamily:font.body,fontWeight:700,fontSize:15,color:T.white,cursor:"pointer",
            boxShadow:"0 5px 18px rgba(240,165,0,0.4)",
            opacity:phase==="scanning"?0.7:1}}>
            {phase==="scanning"?"Scanning…":"📷 Scan Now"}
          </button>
          <button style={{padding:"16px 18px",borderRadius:16,
            border:"1.5px solid rgba(247,243,236,0.15)",background:"transparent",
            fontFamily:font.body,fontWeight:700,fontSize:13,color:T.cream,cursor:"pointer"}}>Manual</button>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   SCREEN: AI CHEF
══════════════════════════════════════════ */
const initMsgs=[
  {r:"ai", t:"Hey! I'm your Smart Kitchen AI 🌱 Ask me for recipes, nutrition facts, or shopping suggestions."},
  {r:"user",t:"I want a high-protein breakfast using Just Egg."},
  {r:"ai", t:"Try a Golden Scramble Bowl! Just Egg liquid + spinach + turmeric = 12g protein, 210 kcal, and 92% less CO₂ than conventional eggs. Want me to add Just Egg to your cart? 🛒"},
];

const AI = () => {
  const [msgs,setMsgs]=useState(initMsgs);
  const [input,setInput]=useState("");
  const bottom=useRef(null);
  useEffect(()=>{bottom.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  const send=()=>{
    if(!input.trim())return;
    const userMsg=input;
    setInput("");
    setMsgs(m=>[...m,{r:"user",t:userMsg}]);
    setTimeout(()=>setMsgs(m=>[...m,{r:"ai",
      t:"Great question! Based on your eco goals, I'd suggest using Pea Protein Isolate in that recipe — it has the lowest carbon footprint per gram of protein (27g/serving, 0.4kg CO₂). Want a full recipe or add it to your cart? 🌱"}]),900);
  };

  const chips=["🥚 Egg-free breakfast","🥩 Meat alt dinner","💪 High protein meal","⚡ Under 10 min"];
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:T.cream,overflow:"hidden"}}>
      {/* Header */}
      <div style={{padding:"14px 20px",background:T.white,
        borderBottom:`1px solid ${T.parchment}`,
        display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,height:44,borderRadius:14,
          background:`linear-gradient(135deg,${T.pine},${T.sage})`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🤖</div>
        <div>
          <h3 style={{fontFamily:font.display,fontSize:17,fontWeight:700,
            color:T.ink,margin:0}}>Smart Kitchen AI</h3>
          <p style={{fontFamily:font.body,fontSize:11,color:T.sage,margin:0,fontWeight:600}}>
            ● Online · Eco-aware · Shop-connected</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflow:"auto",padding:"16px 20px",display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.r==="user"?"flex-end":"flex-start",
            animation:"fadeUp 0.3s ease-out"}}>
            <div style={{maxWidth:"80%",padding:"12px 15px",
              borderRadius:m.r==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
              background:m.r==="user"?`linear-gradient(135deg,${T.pine},${T.sage})`:T.white,
              boxShadow:"0 2px 10px rgba(0,0,0,0.07)"}}>
              <p style={{fontFamily:font.body,fontSize:13,
                color:m.r==="user"?T.white:T.ink,margin:0,lineHeight:1.55}}>{m.t}</p>
            </div>
          </div>
        ))}
        {/* Quick-add product chips from AI */}
        {msgs[msgs.length-1]?.r==="ai"&&(
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["🛒 Add Just Egg","📋 Full Recipe","💡 More ideas"].map(c=>(
              <button key={c} onClick={()=>setInput(c)} style={{
                padding:"7px 12px",borderRadius:12,
                border:`1px solid ${T.mist}`,background:T.white,
                fontFamily:font.body,fontSize:11,color:T.pine,fontWeight:600,cursor:"pointer"}}>
                {c}
              </button>
            ))}
          </div>
        )}
        <div style={{marginBottom:4}} ref={bottom}/>
        {/* Suggestion chips */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {chips.map(c=>(
            <button key={c} onClick={()=>setInput(c)} style={{
              padding:"8px 12px",borderRadius:12,
              border:`1px solid ${T.mist}`,background:T.white,
              fontFamily:font.body,fontSize:11,color:T.forest,fontWeight:600,cursor:"pointer"}}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{padding:"12px 16px 16px",background:T.white,
        borderTop:`1px solid ${T.parchment}`,display:"flex",gap:10,alignItems:"center"}}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Ask about recipes, products, nutrition…"
          style={{flex:1,padding:"12px 16px",borderRadius:14,
            border:`1.5px solid ${T.mist}`,background:T.cream,
            fontFamily:font.body,fontSize:13,color:T.ink,outline:"none"}}/>
        <button onClick={send} style={{
          width:44,height:44,borderRadius:14,border:"none",
          background:`linear-gradient(135deg,${T.pine},${T.sage})`,
          fontSize:18,cursor:"pointer",
          boxShadow:"0 4px 12px rgba(45,90,27,0.3)"}}>➤</button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   SCREEN: PROFILE / ECO IMPACT
══════════════════════════════════════════ */
const Profile = () => (
  <div style={{flex:1,overflow:"auto",background:T.cream}}>
    <div style={{background:`linear-gradient(160deg,${T.ink},${T.pine})`,
      padding:"24px 20px 44px",textAlign:"center",borderRadius:"0 0 36px 36px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-30,right:-30,width:160,height:160,borderRadius:"50%",
        background:"rgba(240,165,0,0.06)",pointerEvents:"none"}}/>
      <div style={{width:84,height:84,borderRadius:"50%",
        background:"rgba(247,243,236,0.12)",border:"3px solid rgba(247,243,236,0.3)",
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:42,margin:"0 auto 14px"}}>👤</div>
      <h2 style={{fontFamily:font.display,fontSize:24,fontWeight:700,
        color:T.cream,margin:"0 0 4px"}}>Alex Green</h2>
      <p style={{fontFamily:font.body,fontSize:12,color:"rgba(200,221,178,0.65)",margin:0}}>
        Eco Champion · Member since Jan 2025</p>
      <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:14}}>
        <Badge text="🏆 Top 5%" color={T.yolk}/>
        <Badge text="24-Day Streak" color={T.mist}/>
      </div>
    </div>

    <div style={{padding:20,marginTop:-16}}>
      {/* Eco stats grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
        {ECO.map(e=>(
          <div key={e.label} style={{background:T.white,borderRadius:20,padding:16,
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:30,marginBottom:8}}>{e.icon}</div>
            <div style={{fontFamily:font.display,fontSize:24,fontWeight:700,color:e.color,lineHeight:1}}>{e.value}</div>
            <div style={{fontFamily:font.body,fontSize:11,color:T.gray1,marginTop:4}}>{e.label}</div>
          </div>
        ))}
      </div>

      {/* CO2 bar chart */}
      <div style={{background:T.white,borderRadius:20,padding:18,
        marginBottom:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
        <h4 style={{fontFamily:font.display,fontSize:18,fontWeight:700,
          color:T.ink,margin:"0 0 16px"}}>Weekly CO₂ Saved</h4>
        <div style={{display:"flex",alignItems:"flex-end",gap:6,height:72}}>
          {[38,58,48,76,66,88,72].map((h,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",
              alignItems:"center",gap:4}}>
              <div style={{width:"100%",height:`${h}%`,
                background:i===6?`linear-gradient(180deg,${T.yolk},${T.ember})`:T.mist,
                borderRadius:"5px 5px 2px 2px",transition:"height 0.5s"}}/>
              <span style={{fontFamily:font.body,fontSize:9,color:T.gray1}}>
                {"SMTWTFS"[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <h3 style={{fontFamily:font.display,fontSize:18,fontWeight:700,
        color:T.ink,margin:"0 0 12px"}}>Eco Badges</h3>
      <div style={{display:"flex",gap:10,marginBottom:24,overflowX:"auto"}}>
        {[["🌱","Pioneer"],["⚡","Speed Cook"],["🌍","Earth+"],["🏆","Champion"],["🛒","Smart Shop"]].map(([ic,l])=>(
          <div key={l} style={{minWidth:64,background:T.white,borderRadius:16,
            padding:"12px 6px",textAlign:"center",
            boxShadow:"0 2px 8px rgba(0,0,0,0.05)",flexShrink:0}}>
            <div style={{fontSize:26}}>{ic}</div>
            <div style={{fontFamily:font.body,fontSize:"9px",color:T.gray1,
              textTransform:"uppercase",letterSpacing:"0.3px",marginTop:4,lineHeight:1.2}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Purchase history */}
      <h3 style={{fontFamily:font.display,fontSize:18,fontWeight:700,
        color:T.ink,margin:"0 0 12px"}}>Recent Orders</h3>
      {[
        {emoji:"🥚",name:"Just Egg Liquid × 2",date:"Mar 4",price:"$13.98",co2:"↓ 0.2kg"},
        {emoji:"🥩",name:"Beyond Beef Mince × 1",date:"Feb 28",price:"$9.99",co2:"↓ 2.1kg"},
        {emoji:"💪",name:"Pea Protein × 1",date:"Feb 22",price:"$24.99",co2:"↓ 0.4kg"},
      ].map((o,i)=>(
        <div key={i} style={{background:T.white,borderRadius:16,padding:14,
          marginBottom:8,display:"flex",gap:12,alignItems:"center",
          boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
          <span style={{fontSize:28}}>{o.emoji}</span>
          <div style={{flex:1}}>
            <div style={{fontFamily:font.body,fontSize:13,fontWeight:700,color:T.ink}}>{o.name}</div>
            <div style={{fontFamily:font.body,fontSize:11,color:T.gray1,margin:"2px 0"}}>
              {o.date} · {o.price}</div>
          </div>
          <GreenTag text={o.co2}/>
        </div>
      ))}

      {/* Settings */}
      <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:8}}>
        {["⚙️  App Settings","🔔  Notifications","🌿  Dietary Preferences","🛒  Order History","📤  Share My Impact"].map(l=>(
          <div key={l} style={{background:T.white,borderRadius:14,padding:"14px 16px",
            display:"flex",justifyContent:"space-between",alignItems:"center",
            boxShadow:"0 1px 6px rgba(0,0,0,0.04)",cursor:"pointer"}}>
            <span style={{fontFamily:font.body,fontSize:14,fontWeight:600,color:T.ink}}>{l}</span>
            <span style={{color:T.gray1,fontSize:18}}>›</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   ROOT: PHONE FRAME + SIDE PANELS
══════════════════════════════════════════ */
export default function App() {
  const [flow,setFlow]=useState("splash"); // splash | onboarding | app
  const [tab,setTab]=useState("home");
  const [panel,setPanel]=useState("nav"); // nav | arch | tech

  const screenMap={home:<Home setTab={setTab}/>,shop:<Shop/>,scanner:<Scanner/>,ai:<AI/>,profile:<Profile/>};
  const screenLabel={home:"Home Feed",shop:"Sustainable Shop",scanner:"AI Fridge Scanner",ai:"Chef AI",profile:"Eco Profile"};

  return(
    <div style={{
      background:"#0D0D0D",minHeight:"100vh",display:"flex",
      gap:24,padding:24,alignItems:"flex-start",
      justifyContent:"center",flexWrap:"wrap",
      fontFamily:font.body,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet"/>

      {/* ── LEFT PANEL ── */}
      <div style={{width:272,flexShrink:0,paddingTop:4}}>
        <div style={{marginBottom:20}}>
          <div style={{fontFamily:font.display,fontSize:26,fontWeight:700,color:"#EDE7D9",lineHeight:1}}>Just Egg</div>
          <div style={{fontFamily:font.body,fontSize:10,color:"#4A4A4A",
            textTransform:"uppercase",letterSpacing:"3px",marginTop:3}}>Smart Kitchen · FlutterFlow App</div>
        </div>

        {/* Panel tabs */}
        <div style={{display:"flex",background:"#1A1A1A",borderRadius:12,padding:3,marginBottom:16,gap:2}}>
          {["nav","arch","tech"].map(p=>(
            <button key={p} onClick={()=>setPanel(p)} style={{
              flex:1,padding:"7px 0",borderRadius:10,border:"none",
              background:panel===p?T.yolk:"transparent",
              color:panel===p?T.ink:"#555",
              fontFamily:font.body,fontSize:11,fontWeight:700,cursor:"pointer",
              textTransform:"capitalize"}}>
              {p==="nav"?"Navigate":p==="arch"?"Structure":"Tech"}
            </button>
          ))}
        </div>

        {panel==="nav"&&(
          <>
            <p style={{fontFamily:font.body,fontSize:10,color:"#444",margin:"0 0 10px",
              textTransform:"uppercase",letterSpacing:"1px"}}>Jump to Screen</p>
            {[
              {id:"splash_ob",icon:"🌱",lbl:"Splash & Onboarding",desc:"First-run flow"},
              {id:"home",icon:"🏠",lbl:"Home Dashboard",desc:"Feed + eco stats"},
              {id:"shop",icon:"🛒",lbl:"Sustainable Shop",desc:"Eggs · proteins · meat alts"},
              {id:"scanner",icon:"📷",lbl:"AI Fridge Scanner",desc:"Vision-powered scan"},
              {id:"ai",icon:"🤖",lbl:"Chef AI Chat",desc:"Recipe & shop AI"},
              {id:"profile",icon:"🌍",lbl:"Eco Profile",desc:"Impact & orders"},
            ].map(s=>{
              const isActive = s.id==="splash_ob"
                ? (flow==="splash"||flow==="onboarding")
                : (flow==="app"&&tab===s.id);
              return(
                <button key={s.id} onClick={()=>{
                  if(s.id==="splash_ob"){setFlow("splash");}
                  else{setFlow("app");setTab(s.id);}
                }} style={{
                  width:"100%",background:isActive?"rgba(240,165,0,0.12)":"#1C1C1C",
                  border:`1.5px solid ${isActive?T.yolk:"transparent"}`,
                  borderRadius:12,padding:"11px 14px",marginBottom:6,
                  cursor:"pointer",display:"flex",alignItems:"center",gap:10,textAlign:"left"}}>
                  <span style={{fontSize:18}}>{s.icon}</span>
                  <div>
                    <div style={{fontFamily:font.body,fontSize:12,fontWeight:700,
                      color:isActive?T.yolk:"#D0CAC0"}}>{s.lbl}</div>
                    <div style={{fontFamily:font.body,fontSize:10,color:"#555"}}>{s.desc}</div>
                  </div>
                </button>
              );
            })}
            <button onClick={()=>setFlow("splash")} style={{
              width:"100%",marginTop:4,padding:10,borderRadius:12,
              border:"1px solid #2A2A2A",background:"transparent",
              fontFamily:font.body,fontSize:11,color:"#444",cursor:"pointer"}}>
              ↺ Restart from Splash
            </button>
          </>
        )}

        {panel==="arch"&&(
          <div>
            {[
              {g:"Auth Flow",   items:["Splash Screen","Onboarding (3 steps)","Sign Up / Login / SSO"]},
              {g:"Main Screens",items:["Home Dashboard","Sustainable Shop","AI Fridge Scanner","Chef AI Chat","Eco Profile"]},
              {g:"Shop Module", items:["Product grid + filters","Product detail page","Cart & checkout","Order history","Subscription bundles"]},
              {g:"AI Features", items:["Claude-powered Chef AI","Vision fridge scanner","CO₂ impact calculator","Smart shopping list","Personalisation engine"]},
              {g:"Data Models", items:["User · Profile · Prefs","Product catalogue","Order · Cart","Recipe collection","Eco metrics · Badges","Chat history"]},
            ].map(g=>(
              <div key={g.g} style={{marginBottom:14}}>
                <p style={{fontFamily:font.body,fontSize:10,fontWeight:700,color:T.yolk,
                  margin:"0 0 6px",textTransform:"uppercase",letterSpacing:"0.5px"}}>{g.g}</p>
                {g.items.map(it=>(
                  <div key={it} style={{padding:"6px 10px",borderRadius:8,background:"#1C1C1C",
                    marginBottom:3,fontFamily:font.body,fontSize:11,color:"#B0AAA0",
                    display:"flex",alignItems:"center",gap:6}}>
                    <span style={{width:4,height:4,borderRadius:"50%",
                      background:T.sage,display:"inline-block",flexShrink:0}}/>
                    {it}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {panel==="tech"&&(
          <div>
            {[
              {g:"Core",     items:["FlutterFlow (UI builder)","Flutter 3 / Dart","Firebase Auth + Firestore","Firebase Storage"]},
              {g:"AI Layer", items:["Claude API (Chef AI)","TensorFlow Lite (scanner)","OpenFoodFacts API","Carbon footprint API"]},
              {g:"Commerce", items:["Stripe payments","RevenueCat (subscriptions)","Shippo (shipping)","Product catalogue CMS"]},
              {g:"Analytics",items:["Mixpanel events","Firebase Analytics","Custom eco-impact DB","A/B testing (Statsig)"]},
            ].map(g=>(
              <div key={g.g} style={{marginBottom:14}}>
                <p style={{fontFamily:font.body,fontSize:10,fontWeight:700,color:T.yolk,
                  margin:"0 0 6px",textTransform:"uppercase",letterSpacing:"0.5px"}}>{g.g}</p>
                {g.items.map(it=>(
                  <div key={it} style={{padding:"6px 10px",borderRadius:8,background:"#1C1C1C",
                    marginBottom:3,fontFamily:font.body,fontSize:11,color:"#B0AAA0",
                    display:"flex",alignItems:"center",gap:6}}>
                    <span style={{width:4,height:4,borderRadius:"50%",
                      background:T.sky,display:"inline-block",flexShrink:0}}/>
                    {it}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── PHONE ── */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
        <div style={{background:"#1E1E1E",borderRadius:6,padding:"4px 12px",
          fontFamily:font.body,fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"1.2px"}}>
          {flow==="splash"?"Splash":flow==="onboarding"?"Onboarding":screenLabel[tab]}
        </div>

        {/* Phone shell */}
        <div style={{
          width:364,height:750,
          background:"#1A1A1A",
          borderRadius:52,
          padding:13,
          boxShadow:"0 36px 90px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.1)",
          position:"relative",
        }}>
          {/* Dynamic island */}
          <div style={{position:"absolute",top:15,left:"50%",transform:"translateX(-50%)",
            width:110,height:30,background:"#111",borderRadius:15,zIndex:20,
            display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:"#222",border:"1px solid #333"}}/>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#1A1A1A"}}/>
          </div>

          {/* Screen */}
          <div style={{width:"100%",height:"100%",background:T.cream,
            borderRadius:40,overflow:"hidden",display:"flex",flexDirection:"column"}}>
            <StatusBar/>
            {flow==="splash"   && <Splash     onDone={()=>setFlow("onboarding")}/>}
            {flow==="onboarding"&& <Onboarding onDone={()=>{setFlow("app");setTab("home");}}/>}
            {flow==="app"      && <>
              {screenMap[tab]}
              <BottomNav active={tab} set={setTab}/>
            </>}
          </div>
        </div>

        <div style={{fontFamily:font.body,fontSize:10,color:"#333",textAlign:"center"}}>
          Interactive prototype · click sidebar to navigate
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{width:252,flexShrink:0,paddingTop:4}}>
        <p style={{fontFamily:font.body,fontSize:10,color:"#444",margin:"0 0 12px",
          textTransform:"uppercase",letterSpacing:"1px"}}>App Features</p>
        {[
          {icon:"🥚",title:"Plant-Based Eggs",    desc:"Just Egg liquid & folded — full product detail, nutrition, CO₂ comparison."},
          {icon:"🥩",title:"Meat Alternatives",   desc:"Beyond Beef, Impossible Burger, oat sausage — shop, cook, track impact."},
          {icon:"💪",title:"Protein Shop",        desc:"Pea isolate, tempeh, lentil blend — searchable catalogue with cart."},
          {icon:"🤖",title:"Chef AI + Shopping",  desc:"Claude AI suggests recipes AND lets you add missing products to cart inline."},
          {icon:"📷",title:"Fridge Scanner",      desc:"Vision AI detects ingredients and auto-fills recipe + shopping gaps."},
          {icon:"🌿",title:"CO₂ Tracker",         desc:"Per-meal and lifetime environmental impact vs conventional products."},
          {icon:"🏆",title:"Gamification",        desc:"Streaks, eco points, badges, leaderboard and weekly CO₂ charts."},
          {icon:"🛒",title:"Integrated Checkout", desc:"Stripe payments, order history, subscription bundles, reorder flow."},
        ].map(f=>(
          <div key={f.title} style={{background:"#1C1C1C",borderRadius:14,
            padding:"12px 14px",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
              <span style={{fontSize:17}}>{f.icon}</span>
              <span style={{fontFamily:font.body,fontSize:12,fontWeight:700,color:"#D5CFC5"}}>{f.title}</span>
            </div>
            <p style={{fontFamily:font.body,fontSize:11,color:"#555",margin:0,lineHeight:1.5}}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
