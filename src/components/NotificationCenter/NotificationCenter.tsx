import { Toaster } from 'react-hot-toast';

const options = {
  duration: 5000,
  style: {
    paddingRight: '2rem',
    paddingLeft: '2rem'
  },
  success: {
    style: {
      background: '#00ac00',
      color: 'white'
    }
  },
  error: {
    style: {
      background: '#d80202',
      color: 'white'
    }
  }
};

function NotificationCenter() {
  return <Toaster position="bottom-center" toastOptions={options} />;
}

export default NotificationCenter;
