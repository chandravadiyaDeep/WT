/* StudentHub demonstration data. Replace these arrays with API responses in the PHP/MySQL deployment. */
window.STUDENTHUB_DATA = {
 events: [
  {id:1,title:"TechSpark 2026",category:"Technology",date:"2026-11-21",time:"10:00 AM",venue:"CHARUSAT Auditorium",organizer:"CSPIT Tech Forum",seats:80,description:"A day of student innovation, rapid prototyping and technology talks.",theme:"tech"},
  {id:2,title:"Campus Unplugged",category:"Cultural",date:"2026-11-23",time:"05:30 PM",venue:"Open Air Theatre",organizer:"Cultural Committee",seats:120,description:"An evening of music, performances and creative expression.",theme:"culture"},
  {id:3,title:"Run for Tomorrow",category:"Sports",date:"2026-11-28",time:"06:30 AM",venue:"University Sports Ground",organizer:"Sports Council",seats:200,description:"Bring your energy and join the campus community run.",theme:"sport"},
  {id:4,title:"Design Thinking Lab",category:"Workshops",date:"2026-12-02",time:"11:00 AM",venue:"Innovation Centre",organizer:"IIC CHARUSAT",seats:35,description:"A hands-on workshop to learn problem framing and creative ideation.",theme:"workshop"},
  {id:5,title:"AI & ML Student Summit",category:"Technology",date:"2026-12-05",time:"09:30 AM",venue:"Seminar Hall 2",organizer:"AI/ML Student Chapter",seats:65,description:"Explore practical machine learning projects and responsible AI.",theme:"tech"},
  {id:6,title:"Startup Pitch Evening",category:"Competitions",date:"2026-12-10",time:"02:00 PM",venue:"Incubation Centre",organizer:"E-Cell",seats:40,description:"Pitch your idea, get feedback and meet aspiring founders.",theme:"workshop"}
 ],
 news: [
  {id:1,title:"Welcome to StudentHub",date:"2026-11-14",category:"Platform",body:"StudentHub brings campus events, announcements and student resources into one connected experience. Explore the pages and try the interactive demo."},
  {id:2,title:"Explore upcoming campus workshops",date:"2026-11-12",category:"Opportunities",body:"The upcoming calendar includes hands-on sessions and opportunities to learn new skills alongside fellow students."},
  {id:3,title:"Student community is open",date:"2026-11-08",category:"Community",body:"Share a question, start a conversation or help a classmate. The community page demonstrates a simple student discussion feed."}
 ],
 faqs: [
  {q:"How do I register for StudentHub?",a:"Open the Join StudentHub page, complete the registration form and submit it. This GitHub Pages edition stores a demonstration profile in your browser only; it is not a real university account."},
  {q:"How do I reset my password?",a:"The static demonstration does not send password-reset emails. In a production version, a PHP endpoint would issue a time-limited reset token and send a verified reset link."},
  {q:"How do I update my profile?",a:"Open the Profile page from the student dashboard. The demo lets you update local browser profile details. A production version saves changes after server-side authentication."},
  {q:"How can I register for an event?",a:"Browse Campus Events and select Register. In this static edition, the registration is saved to your browser's local storage for demonstration."},
  {q:"How do I contact administrators?",a:"Use the Contact form. It demonstrates client-side validation. To receive messages, connect the form to a PHP endpoint or a trusted form service."},
  {q:"Is this the complete PHP/MySQL application?",a:"No. GitHub Pages hosts static HTML, CSS and JavaScript; it does not execute PHP or provide MySQL. The repository includes a local XAMPP implementation guide for backend practicals."}
 ],
 discussions:[
  {id:1,author:"Aarav P.",time:"Today · 10:24 AM",tag:"Technology",title:"Anyone joining the student hackathon?",body:"Looking to form a small team for the upcoming innovation event. Interested in frontend, Python or UI/UX?"},
  {id:2,author:"Mira S.",time:"Yesterday · 4:10 PM",tag:"Academics",title:"Good resources for learning JavaScript?",body:"I am practicing DOM manipulation and Fetch API. Share the resources that helped you understand the concepts."}
 ]
};