'use client';
import { useState, useEffect } from 'react';
import { Wrench, Clock, Mail, RefreshCw } from 'lucide-react';

export default function MaintenancePage() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 30,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-lg text-center">
        {/* Maintenance Icon */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full opacity-20"></div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Wrench className="w-16 h-16 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Maintenance Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-navy mb-4">We'll be back soon!</h1>
          <p className="text-gray-text mb-6">
            We're currently performing scheduled maintenance to improve your experience. 
            We apologize for any inconvenience.
          </p>

          {/* Estimated Time */}
          <div className="bg-white border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-navy">Estimated completion time</span>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-navy">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-text">Hours</div>
              </div>
              <div className="text-2xl text-gray-text">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-navy">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-text">Minutes</div>
              </div>
              <div className="text-2xl text-gray-text">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-navy">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-text">Seconds</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Check Again
          </button>

          <div className="flex gap-3 justify-center">
            <a
              href="mailto:support@stratos.com"
              className="flex items-center gap-2 px-4 py-2 border border-border text-navy rounded-lg hover:border-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
          </div>
        </div>

        {/* Status Updates */}
        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="text-sm font-semibold text-navy mb-3">What we're working on:</h3>
          <ul className="text-sm text-gray-text space-y-2 text-left">
            <li>• Database optimization and performance improvements</li>
            <li>• Security updates and patches</li>
            <li>• New feature deployments</li>
            <li>• System monitoring enhancements</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="mt-8">
          <p className="text-sm text-gray-text">
            Need immediate assistance? Contact us at{' '}
            <a href="mailto:support@stratos.com" className="text-primary hover:underline">
              support@stratos.com
            </a>
          </p>
        </div>

        {/* Social Media Updates */}
        <div className="mt-6">
          <p className="text-xs text-gray-text">
            Follow us on{' '}
            <a href="#" className="text-primary hover:underline">Twitter</a>{' '}
            for real-time updates during maintenance.
          </p>
        </div>
      </div>
    </div>
  );
}
