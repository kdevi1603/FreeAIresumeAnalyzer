import React from 'react';

export default function BeforeAfterGraphic() {
  return (
    <div className="before-after-container">
      {/* Before Resume */}
      <div className="resume-mockup before-resume">
        <div className="before-label">Before</div>
        <div className="resume-body-mockup">
          <div className="mockup-sidebar" style={{ backgroundColor: '#2B7FFF', color: 'white', padding: '16px 12px' }}>
            <h2 style={{ fontSize: '14px', lineHeight: '1.1', marginBottom: '8px', color: 'white' }}>Charles<br/>Bloomberg</h2>
            <p style={{ fontSize: '7px', lineHeight: '1.3', marginBottom: '20px', opacity: 0.9 }}>Product Manager /<br/>Founder / Strategy /<br/>Web</p>
            
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '6px', fontWeight: 'bold', marginBottom: '4px', letterSpacing: '1px', opacity: 0.8 }}>CONTACT</h3>
              <p style={{ fontSize: '5px', opacity: 0.7, marginBottom: '2px' }}>charles@email</p>
              <p style={{ fontSize: '5px', opacity: 0.7 }}>phone available</p>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '6px', fontWeight: 'bold', marginBottom: '6px', letterSpacing: '1px', opacity: 0.8 }}>SKILLS</h3>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.3)', width: '80%', marginBottom: '4px', borderRadius: '2px' }}></div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.3)', width: '60%', marginBottom: '4px', borderRadius: '2px' }}></div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.3)', width: '90%', marginBottom: '4px', borderRadius: '2px' }}></div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '6px', fontWeight: 'bold', marginBottom: '6px', letterSpacing: '1px', opacity: 0.8 }}>TOOLS</h3>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.3)', width: '70%', marginBottom: '4px', borderRadius: '2px' }}></div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.3)', width: '85%', marginBottom: '4px', borderRadius: '2px' }}></div>
            </div>

            <div>
              <h3 style={{ fontSize: '6px', fontWeight: 'bold', marginBottom: '6px', letterSpacing: '1px', opacity: 0.8 }}>EDUCATION</h3>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.3)', width: '95%', marginBottom: '4px', borderRadius: '2px' }}></div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.3)', width: '50%', marginBottom: '4px', borderRadius: '2px' }}></div>
            </div>
          </div>

          <div className="mockup-main" style={{ padding: '16px', flex: 1, backgroundColor: 'white' }}>
            <h1 style={{ fontSize: '16px', color: '#111', marginBottom: '2px', letterSpacing: '-0.5px' }}>Charles Bloomberg</h1>
            <h2 style={{ fontSize: '6px', color: '#2B7FFF', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '16px', textTransform: 'uppercase' }}>Product Manager - Melbourne, Victoria</h2>

            <div className="mockup-section" style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '7px', color: '#444', letterSpacing: '1px', marginBottom: '6px' }}>ABOUT ME</h3>
              <p style={{ fontSize: '6.5px', color: '#333', marginBottom: '4px' }}>Hard worker. Fast learner. I like products.</p>
              <p style={{ fontSize: '6.5px', color: '#333' }}>Looking for a good job where I can grow.</p>
            </div>

            <div className="mockup-section" style={{ marginBottom: '16px', backgroundColor: '#f4f7fb', padding: '8px', borderRadius: '4px' }}>
              <h3 style={{ fontSize: '7px', color: '#444', letterSpacing: '1px', marginBottom: '6px' }}>WORK STUFF</h3>
              <ul style={{ paddingLeft: '12px', margin: 0, fontSize: '6.5px', color: '#333', lineHeight: '1.6' }}>
                <li style={{ marginBottom: '4px' }}>Did manager things at companies</li>
                <li style={{ marginBottom: '4px' }}>Worked on projects and helped the team</li>
                <li>Used meetings, docs, emails, dashboards</li>
              </ul>
            </div>

            <div className="mockup-section" style={{ position: 'relative' }}>
              <h3 style={{ fontSize: '7px', color: '#444', letterSpacing: '1px', marginBottom: '6px' }}>SKILLS</h3>
              <p style={{ fontSize: '6.5px', color: '#555', lineHeight: '1.4' }}>Leadership, strategy, Excel, startup, communication, analytics, sales, internet</p>
              {/* Feedback scribbles */}
              <div style={{ position: 'absolute', top: '10px', right: '10px', color: '#00A3FF', fontSize: '5px', fontWeight: 'bold', opacity: 0.6, transform: 'rotate(-5deg)' }}>NO DATES</div>
              <div style={{ position: 'absolute', top: '22px', right: '20px', color: '#00A3FF', fontSize: '5px', fontWeight: 'bold', opacity: 0.6, transform: 'rotate(-2deg)' }}>NO METRICS</div>
              <div style={{ position: 'absolute', top: '32px', right: '5px', color: '#00A3FF', fontSize: '5px', fontWeight: 'bold', opacity: 0.6, transform: 'rotate(4deg)' }}>VAGUE CONTENT</div>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="arrow-container hidden-on-mobile">
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="curved-arrow">
          <path d="M5 30 C 20 20, 35 15, 55 25" stroke="#00A3FF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 47 15 L 57 26 L 45 32" stroke="#00A3FF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* After Resume */}
      <div className="resume-mockup after-resume">
        <div className="after-label">After</div>
        <div style={{ padding: '24px 16px', backgroundColor: 'white', height: '100%', position: 'relative' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '12px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
            <h1 style={{ fontSize: '14px', color: '#111', marginBottom: '4px' }}>Charles Bloomberg</h1>
            <p style={{ fontSize: '4px', color: '#555' }}>Product Manager - Melbourne, Victoria | charles@email.com | +61 772 3345 | Seoul, South Korea | LinkedIn</p>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <h3 style={{ fontSize: '5px', fontWeight: 'bold', borderBottom: '1px solid #111', display: 'inline-block', marginBottom: '4px', textTransform: 'uppercase' }}>PROFESSIONAL SUMMARY</h3>
            <p style={{ fontSize: '4px', lineHeight: '1.4', color: '#333' }}>Product manager and startup operator known for building scaling companies through industry-leading tech, design, and execution. Experienced early-stage global operator with a strong record of turning customer insights into measurable work flow improvements.</p>
          </div>

          <div style={{ marginBottom: '10px' }}>
             <h3 style={{ fontSize: '5px', fontWeight: 'bold', borderBottom: '1px solid #111', display: 'inline-block', marginBottom: '6px', textTransform: 'uppercase' }}>PROFESSIONAL EXPERIENCE</h3>
             
             <div style={{ marginBottom: '8px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                 <span style={{ fontSize: '4.5px', fontWeight: 'bold' }}>Product Manager - Acme Corp</span>
                 <span style={{ fontSize: '4px' }}>Aug 2019 - Present | Seoul, South Korea</span>
               </div>
               <ul style={{ paddingLeft: '10px', margin: 0, fontSize: '4px', lineHeight: '1.4', color: '#333' }}>
                 <li>Collaborated with the development team to engineer scalable partnerships and drop shipping opportunity.</li>
                 <li>Implemented product workflows that improved revenue clearly beyond targeting and mandate confidence.</li>
               </ul>
             </div>

             <div style={{ marginBottom: '8px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                 <span style={{ fontSize: '4.5px', fontWeight: 'bold' }}>Web Developer - Kaplan</span>
                 <span style={{ fontSize: '4px' }}>Mar 2016 - May 2018 | La Crosse, WI</span>
               </div>
               <ul style={{ paddingLeft: '10px', margin: 0, fontSize: '4px', lineHeight: '1.4', color: '#333' }}>
                 <li>Redesigned landing page variants and content paths for higher conversion rate, improving readability.</li>
                 <li>Created and managed SEO strategies, monitoring rankings using MOZ Analytics for a $8K budget.</li>
                 <li>Executed Google Analytics tracking strategies to combine effectiveness of pre-fill re-marketing displayed.</li>
               </ul>
             </div>
             
             <div style={{ marginBottom: '8px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                 <span style={{ fontSize: '4.5px', fontWeight: 'bold' }}>Marketing Analyst - Kaplan</span>
                 <span style={{ fontSize: '4px' }}>Nov 2014 - May 2015 | La Crosse, WI</span>
               </div>
               <div style={{ width: '100%', height: '3px', background: '#ddd', marginBottom: '2px' }}></div>
               <div style={{ width: '90%', height: '3px', background: '#ddd', marginBottom: '2px' }}></div>
               <div style={{ width: '85%', height: '3px', background: '#ddd' }}></div>
             </div>
          </div>

        </div>
        
        {/* Floating Badges */}
        <div className="floating-badge badge-professional">
          Professional
        </div>
        <div className="floating-badge badge-ats">
          ATS-friendly
        </div>
      </div>
    </div>
  );
}
