/* Shared navigation, accessible form helpers, client-side demo workflows and rendering. */
(() => {
 "use strict";
 const data = window.STUDENTHUB_DATA || {events:[],news:[],faqs:[],discussions:[]};
 const $ = (selector, root=document) => root.querySelector(selector);
 const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
 const read = (key, fallback) => { try { const value=localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
 const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
 const toast = (message, type="success") => { const region=$(".toast-region"); if(!region)return; const item=document.createElement("div"); item.className="toast "+type; item.textContent=message; region.append(item); setTimeout(()=>item.remove(),3300); };
 const safe = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
 const prettyDate = value => new Date(value+"T12:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
 const initials = name => (name||"Student").trim().split(/\s+/).slice(0,2).map(part=>part[0]).join("").toUpperCase();
 const currentPage = location.pathname.split("/").pop() || "index.html";
 const currentUser = () => read("sh_user", null);
 function setupNav(){
  const toggle=$(".menu-toggle"), nav=$(".main-nav");
  if(toggle&&nav){toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.textContent=open?"×":"☰";});}
  $$(".main-nav a").forEach(link=>{if(link.getAttribute("href")===currentPage)link.classList.add("active");});
  if(currentUser()) $$(".nav-login").forEach(link=>{link.textContent="My dashboard";link.href="dashboard.html";});
 }
 function eventCard(event){
  const theme={tech:"cover-tech",culture:"cover-culture",sport:"cover-sport",workshop:"cover-workshop"}[event.theme]||"cover-tech";
  return `<article class="event-card"><div class="event-cover ${theme}"><span>${safe(event.category).toUpperCase()} · ${prettyDate(event.date)}</span><strong>${safe(event.title)}</strong></div><div class="event-body"><div class="event-meta"><span>◷ ${safe(event.time)}</span><span>⌖ ${safe(event.venue)}</span></div><h3>${safe(event.title)}</h3><p>${safe(event.description)}</p><div class="event-foot"><span>${event.seats} seats shown in demo</span><a href="events.html" data-register="${event.id}">View event ↗</a></div></div></article>`;
 }
 function setupHome(){
  const upcoming=data.events.filter(item=>item.date>="2026-11-17").slice(0,3);
  const homeEvents=$("#home-events"); if(homeEvents)homeEvents.innerHTML=upcoming.map(eventCard).join("");
  const homeNews=$("#home-news"); if(homeNews)homeNews.innerHTML=data.news.slice(0,3).map(item=>`<article><span class="announcement-date">${prettyDate(item.date).toUpperCase()}</span><div><b>${safe(item.title)}</b><p>${safe(item.body)}</p></div><span>↗</span></article>`).join("");
 }
 function setupEvents(){
  const grid=$("#events-grid"); if(!grid)return;
  const search=$("#event-search"), category=$("#event-category"), sort=$("#event-sort"), pageSize=6; let page=1;
  const render=()=>{
   let list=[...data.events]; const query=(search?.value||"").toLowerCase().trim(); if(query)list=list.filter(event=>(event.title+" "+event.description+" "+event.venue).toLowerCase().includes(query));
   if(category?.value)list=list.filter(event=>event.category===category.value);
   if(sort?.value==="name")list.sort((a,b)=>a.title.localeCompare(b.title)); else if(sort?.value==="date-desc")list.sort((a,b)=>b.date.localeCompare(a.date)); else list.sort((a,b)=>a.date.localeCompare(b.date));
   const pages=Math.max(1,Math.ceil(list.length/pageSize)); page=Math.min(page,pages); const slice=list.slice((page-1)*pageSize,page*pageSize);
   grid.innerHTML=slice.length?slice.map(eventCard).join(""):'<div class="empty-state">No matching events. Try a different search or category.</div>';
   const pager=$("#event-pagination");if(pager)pager.innerHTML=Array.from({length:pages},(_,i)=>`<button type="button" data-page="${i+1}" class="${page===i+1?"active":""}" aria-label="Page ${i+1}">${i+1}</button>`).join("");
   const count=$("#event-count");if(count)count.textContent=`Showing ${slice.length} of ${list.length} events`;
  };
  [search,category,sort].forEach(control=>control?.addEventListener("input",()=>{page=1;render();}));
  $("#event-pagination")?.addEventListener("click",event=>{const button=event.target.closest("[data-page]");if(button){page=Number(button.dataset.page);render();}});
  grid.addEventListener("click",event=>{const button=event.target.closest("[data-register]");if(button){event.preventDefault();registerForEvent(Number(button.dataset.register));}});
  render();
 }
 function registerForEvent(id){
  const user=currentUser(); if(!user){toast("Create a demo student account before registering.","error");location.href="login.html";return;}
  const registrations=read("sh_registrations",[]);if(registrations.some(item=>item.eventId===id&&item.email===user.email)){toast("You are already registered for this event.","error");return;}
  const event=data.events.find(item=>item.id===id);if(!event)return;
  registrations.push({eventId:id,email:user.email,registeredAt:new Date().toISOString()});write("sh_registrations",registrations);toast("Demo registration saved in this browser.");
  setupDashboard();
 }
 function setupAuth(){
  const register=$("#register-form"); if(register)register.addEventListener("submit",event=>{
   event.preventDefault(); const form=new FormData(register), password=String(form.get("password")||"");
   const email=String(form.get("email")||"").trim().toLowerCase(), name=String(form.get("name")||"").trim();
   const error=$("#form-message");const fail=message=>{if(error)error.textContent=message;toast(message,"error");};
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return fail("Enter a valid email address.");
   if(!/^[6-9]\d{9}$/.test(String(form.get("mobile")||"")))return fail("Enter a valid 10-digit Indian mobile number.");
   if(password.length<8||!/[A-Z]/.test(password)||!/[a-z]/.test(password)||!/[0-9]/.test(password)||!/[\W_]/.test(password))return fail("Password needs 8+ characters with uppercase, lowercase, number and symbol.");
   if(password!==form.get("confirmPassword"))return fail("Passwords do not match.");
   if(!form.get("terms"))return fail("Please accept the terms.");
   const users=read("sh_users",[]);if(users.some(user=>user.email===email||user.username===form.get("username")||user.studentId===form.get("studentId")))return fail("Email, username or student ID already exists in this browser demo.");
   const user={name,email,username:String(form.get("username")),studentId:String(form.get("studentId")),mobile:String(form.get("mobile")),course:String(form.get("course")),year:String(form.get("year")),city:String(form.get("city")),gender:String(form.get("gender")),role:"student"};
   /* Demo only: store no password. Real authentication must use PHP password_hash/password_verify. */
   users.push(user);write("sh_users",users);write("sh_user",user);toast("Demo account created. Welcome to StudentHub!");location.href="dashboard.html";
  });
  const login=$("#login-form"); if(login)login.addEventListener("submit",event=>{
   event.preventDefault(); const form=new FormData(login), identifier=String(form.get("identifier")||"").toLowerCase(), user=read("sh_users",[]).find(item=>item.email===identifier||item.username.toLowerCase()===identifier||item.studentId.toLowerCase()===identifier);
   if(!user){toast("Demo student not found. Register first.","error");return;}
   /* No password is collected or authenticated in this static preview. */
   write("sh_user",user);toast("Demo session started.");location.href="dashboard.html";
  });
  const admin=$("#admin-login-form");if(admin)admin.addEventListener("submit",event=>{event.preventDefault();write("sh_admin",{name:"Administrator",role:"admin"});toast("Admin preview opened.");location.href="admin.html";});
  const password=$("#register-password"), strength=$("#password-strength");
  password?.addEventListener("input",()=>{const value=password.value;let score=0;[value.length>=8,/[A-Z]/.test(value),/[a-z]/.test(value),/[0-9]/.test(value),/[\W_]/.test(value)].forEach(ok=>{if(ok)score++;});if(strength)strength.textContent=["Add a password","Very weak","Weak","Fair","Strong","Very strong"][score];});
  $$("[data-password-toggle]").forEach(button=>button.addEventListener("click",()=>{const input=$(button.dataset.passwordToggle);if(input)input.type=input.type==="password"?"text":"password";}));
 }
 function setupDashboard(){
  const welcome=$("#welcome-name");if(!welcome)return;const user=currentUser();if(!user){location.href="login.html";return;}
  welcome.textContent=user.name;const studentId=$("#student-id");if(studentId)studentId.textContent=user.studentId;
  const course=$("#student-course");if(course)course.textContent=user.course;
  const year=$("#student-year");if(year)year.textContent=user.year;
  const registered=read("sh_registrations",[]).filter(item=>item.email===user.email);const registrationCount=$("#registration-count");if(registrationCount)registrationCount.textContent=String(registered.length);
  const list=$("#registered-events");if(list){const events=registered.map(item=>data.events.find(event=>event.id===item.eventId)).filter(Boolean);list.innerHTML=events.length?events.map(event=>`<div class="discussion-post"><span class="tag">${safe(event.category)}</span><h3>${safe(event.title)}</h3><p>${prettyDate(event.date)} · ${safe(event.time)} · ${safe(event.venue)}</p></div>`).join(""):'<div class="empty-state">No event registrations yet. <a href="events.html">Explore events ↗</a></div>';}
  $("#logout-button")?.addEventListener("click",()=>{localStorage.removeItem("sh_user");toast("Demo session ended.");location.href="index.html";},{once:true});
 }
 function setupProfile(){
  const form=$("#profile-form");if(!form)return;const user=currentUser();if(!user){location.href="login.html";return;}
  Object.entries(user).forEach(([key,value])=>{const input=form.elements.namedItem(key);if(input)input.value=value;});
  form.addEventListener("submit",event=>{event.preventDefault();const updated={...user,name:form.elements.name.value.trim(),mobile:form.elements.mobile.value,city:form.elements.city.value};write("sh_user",updated);const users=read("sh_users",[]).map(item=>item.email===user.email?updated:item);write("sh_users",users);toast("Profile updated in this browser demo.");});
 }
 function setupNews(){const list=$("#news-list");if(list)list.innerHTML=data.news.map(item=>`<article class="news-item"><div class="news-symbol">✦</div><div><span class="tag">${safe(item.category)}</span><h3>${safe(item.title)}</h3><p>${prettyDate(item.date)} · ${safe(item.body)}</p></div></article>`).join("");}
 function setupFaq(){
  const list=$("#faq-list");if(!list)return;const render=items=>{list.innerHTML=items.map((item,index)=>`<div class="faq-item"><button class="faq-question" type="button" aria-expanded="false">${safe(item.q)}<span>＋</span></button><div class="faq-answer">${safe(item.a)}</div></div>`).join("");};
  render(data.faqs);list.addEventListener("click",event=>{const button=event.target.closest(".faq-question");if(button){const row=button.closest(".faq-item");row.classList.toggle("open");button.setAttribute("aria-expanded",String(row.classList.contains("open")));}});
  $("#faq-search")?.addEventListener("input",event=>render(data.faqs.filter(item=>(item.q+" "+item.a).toLowerCase().includes(event.target.value.toLowerCase()))));
 }
 function setupFeedback(){
  const form=$("#feedback-form");if(!form)return;let rating=0;const stars=$$(".stars button");stars.forEach(button=>button.addEventListener("click",()=>{rating=Number(button.dataset.rating);stars.forEach(item=>item.classList.toggle("selected",Number(item.dataset.rating)<=rating));}));
  form.addEventListener("submit",event=>{event.preventDefault();if(!rating){toast("Please choose a rating.","error");return;}const entries=read("sh_feedback",[]);entries.push({rating,message:form.elements.message.value,category:form.elements.category.value,createdAt:new Date().toISOString()});write("sh_feedback",entries);form.reset();rating=0;stars.forEach(item=>item.classList.remove("selected"));toast("Thank you. Your demo feedback was saved.");});
 }
 function setupContact(){const form=$("#contact-form");form?.addEventListener("submit",event=>{event.preventDefault();const messages=read("sh_messages",[]);messages.push({name:form.elements.name.value,email:form.elements.email.value,subject:form.elements.subject.value,message:form.elements.message.value});write("sh_messages",messages);form.reset();toast("Message saved locally in this browser demo.");});}
 function setupDiscussion(){
  const list=$("#discussion-list");if(!list)return;const saved=read("sh_discussions",[]);const items=[...saved,...data.discussions];
  const render=()=>{list.innerHTML=items.map(item=>`<article class="discussion-post"><span class="tag">${safe(item.tag||"Student post")}</span><h3>${safe(item.title)}</h3><p>${safe(item.body)}</p><small class="muted">${safe(item.author)} · ${safe(item.time)}</small></article>`).join("");};render();
  $("#discussion-form")?.addEventListener("submit",event=>{event.preventDefault();const user=currentUser();if(!user){toast("Log in with a demo account to post.","error");location.href="login.html";return;}const post={id:Date.now(),author:user.name,time:"Just now",tag:"Student post",title:event.target.elements.title.value,body:event.target.elements.body.value};items.unshift(post);write("sh_discussions",[post,...saved]);render();event.target.reset();toast("Discussion post created in the browser demo.");});
  $("#discussion-search")?.addEventListener("input",event=>{const query=event.target.value.toLowerCase();list.innerHTML=items.filter(item=>(item.title+" "+item.body).toLowerCase().includes(query)).map(item=>`<article class="discussion-post"><span class="tag">${safe(item.tag||"Student post")}</span><h3>${safe(item.title)}</h3><p>${safe(item.body)}</p><small class="muted">${safe(item.author)} · ${safe(item.time)}</small></article>`).join("")||'<div class="empty-state">No discussions found.</div>';});
 }
 function setupAdmin(){
  const admin=currentPage==="admin.html";if(!admin)return;const user=read("sh_admin",null);if(!user){location.href="admin-login.html";return;}
  const statUsers=$("#admin-students");if(statUsers)statUsers.textContent=String(read("sh_users",[]).length);
  const statEvents=$("#admin-events");if(statEvents)statEvents.textContent=String(data.events.length);
  const registrations=$("#admin-registrations");if(registrations)registrations.textContent=String(read("sh_registrations",[]).length);
  const feedback=$("#admin-feedback");if(feedback)feedback.textContent=String(read("sh_feedback",[]).length);
  const tbody=$("#admin-student-list");if(tbody){tbody.innerHTML=read("sh_users",[]).map(user=>`<tr><td>${safe(user.name)}</td><td>${safe(user.studentId)}</td><td>${safe(user.email)}</td><td>${safe(user.course)}</td><td>Demo</td></tr>`).join("")||'<tr><td colspan="5">No demo accounts registered.</td></tr>';}
  $("#admin-logout")?.addEventListener("click",()=>{localStorage.removeItem("sh_admin");location.href="index.html";});
 }
 function setupTheme(){
  const dark=read("sh_dark",false);if(dark)document.body.classList.add("site-dark");
  const button=$("#theme-toggle");if(button)button.addEventListener("click",()=>{document.body.classList.toggle("site-dark");write("sh_dark",document.body.classList.contains("site-dark"));});
 }
 function setupAbout(){}
 document.addEventListener("DOMContentLoaded",()=>{setupNav();setupHome();setupEvents();setupAuth();setupDashboard();setupProfile();setupNews();setupFaq();setupFeedback();setupContact();setupDiscussion();setupAdmin();setupTheme();});
 window.StudentHub={toast,registerForEvent};
})();