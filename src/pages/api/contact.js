import axios from 'axios';
import formidable from 'formidable';

const WORDPRESS_URL = 'http://localhost/tiles-trader';
const CUSTOM_API_URL = `${WORDPRESS_URL}/wp-json/my-contact-form/v1/send`;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log('📞 API Route Called');
  console.log('🎯 Posting to:', CUSTOM_API_URL);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = formidable({});
    const [fields] = await form.parse(req);

    console.log('📩 Received fields:', fields);

    // Convert fields to simple object for JSON
    const data = {};
    Object.keys(fields).forEach(key => {
      data[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
    });

    console.log('📤 Sending data:', data);

    const response = await axios.post(CUSTOM_API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Response:', response.data);

    return res.status(200).json(response.data);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Response:', error.response?.data);

    return res.status(500).json({
      status: 'mail_failed',
      message: error.response?.data?.message || error.message,
    });
  }
}