// script.js

// 1. Initialize Supabase Client
const SUPABASE_URL = 'https://uhfjyojyuakvndcamhra.supabase.co'; // Replace with your Supabase Project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZmp5b2p5dWFrdm5kY2FtaHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3OTIzNzksImV4cCI6MjA2NTM2ODM3OX0.kWjYH41sV2CBIrN83mfnV-EI0lfAKCO0eDCaIdcJm6Q'; // Replace with your Supabase Anon Public Key

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Function to Fetch Contact Info from Supabase
async function fetchContactInfo() {
  const { data, error } = await supabase
    .from('contact_info') // Your table name
    .select('*')
    .order('type', { ascending: true }); // Order them as you prefer

  if (error) {
    console.error('Error fetching contact info:', error.message);
    return [];
  }
  return data;
}

// 3. Function to Display Contact Info on the Web Page
function displayContactInfo(contactData) {
  const container = document.getElementById('contact-info-display');
  if (!container) {
    console.error('Contact display container not found.');
    return;
  }
  container.innerHTML = ''; // Clear existing content

  contactData.forEach(item => {
    const section = document.createElement('section');
    section.className = 'khung';
    section.id = item.type; // Use type as ID for consistency if desired, or item.id

    let content = `<h2><i class="${item.icon_class}" style="color:${item.icon_color};"></i> ${item.title}</h2>`;

    if (item.description) {
      content += `<p>${item.description}</p>`;
    }

    if (item.link_text && item.link_url) {
      // Handle special case for phone number to use tel:
      const linkHref = item.type === 'phone' ? `tel:${item.link_url.replace(/\s/g, '')}` : item.link_url;
      content += `<p><strong>${item.type === 'phone' ? 'HOTLINE:' : ''}</strong> <a href="${linkHref}" target="_blank">${item.link_text}</a></p>`;
    }

    if (item.additional_info) {
      content += `<p>${item.additional_info}</p>`;
    }

    // Handle multiple links for Facebook (if needed)
    if (item.type === 'facebook' && item.link_text.includes('Trang liên hệ') && item.additional_info.includes('Nhóm sinh viên')) {
        const facebookLinks = item.link_text.split(',').map(s => s.trim());
        const facebookUrls = item.link_url.split(',').map(s => s.trim());
        const facebookAdditionalInfo = item.additional_info.split(',').map(s => s.trim());

        content = `<h2><i class="${item.icon_class}" style="color:${item.icon_color};"></i> ${item.title}</h2>`;
        content += `<p><a href="${facebookUrls[0]}" target="_blank">${facebookLinks[0]}</a></p>`;
        content += `<p><a href="${facebookUrls[1]}" target="_blank">${facebookAdditionalInfo[0]}</a></p>`;
    }


    section.innerHTML = content;
    container.appendChild(section);
  });
}

// 4. Load contact info when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  const contactInfo = await fetchContactInfo();
  displayContactInfo(contactInfo);
});