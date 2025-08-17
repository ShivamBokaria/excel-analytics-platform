import { useAuth } from '../context/AuthContext';

function SocialLoginButtons({ onSuccess, onError }) {
  const { googleSignIn, appleSignIn } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      // Initialize Google Sign-In
      if (!window.google) {
        // Load Google Identity Services if not already loaded
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        
        script.onload = () => {
          initializeGoogleSignIn();
        };
      } else {
        initializeGoogleSignIn();
      }
    } catch (error) {
      onError?.('Failed to initialize Google Sign-In');
    }
  };

  const initializeGoogleSignIn = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      onError?.('Google Sign-In not configured');
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'email profile',
      callback: async (response) => {
        if (response.error) {
          onError?.(response.error);
          return;
        }
        
        try {
          const result = await googleSignIn(response.access_token);
          if (result.success) {
            onSuccess?.('Google sign-in successful!');
          } else {
            onError?.(result.message);
          }
        } catch (error) {
          onError?.('Google sign-in failed');
        }
      },
    });

    tokenClient.requestAccessToken({ prompt: '' });
  };

  const handleAppleSignIn = async () => {
    try {
      // Initialize Apple Sign-In
      if (!window.AppleID) {
        // Load Apple Sign-In if not already loaded
        const script = document.createElement('script');
        script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
        script.async = true;
        document.head.appendChild(script);
        
        script.onload = () => {
          initializeAppleSignIn();
        };
      } else {
        initializeAppleSignIn();
      }
    } catch (error) {
      onError?.('Failed to initialize Apple Sign-In');
    }
  };

  const initializeAppleSignIn = () => {
    const clientId = import.meta.env.VITE_APPLE_CLIENT_ID;
    if (!clientId) {
      onError?.('Apple Sign-In not configured');
      return;
    }

    try {
      window.AppleID.auth.init({
        clientId: clientId,
        scope: 'email name',
        redirectURI: window.location.origin + '/auth/apple/callback',
        state: 'origin:web',
      });

      window.AppleID.auth.signIn().then(async (response) => {
        try {
          const result = await appleSignIn(response.authorization.id_token);
          if (result.success) {
            onSuccess?.('Apple sign-in successful!');
          } else {
            onError?.(result.message);
          }
        } catch (error) {
          onError?.('Apple sign-in failed');
        }
      }).catch((error) => {
        onError?.('Apple sign-in cancelled or failed');
      });
    } catch (error) {
      onError?.('Apple Sign-In initialization failed');
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleGoogleSignIn}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
        
        <button
          onClick={handleAppleSignIn}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-black text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Apple
        </button>
      </div>
    </div>
  );
}

export default SocialLoginButtons;
