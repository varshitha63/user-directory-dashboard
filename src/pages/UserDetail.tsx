import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../services/api';
import { User } from '../types';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Building2, 
  User as UserIcon,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await getUserById(id);
        setUser(response.data);
        document.title = `User - ${response.data.name}`;
      } catch (err) {
        setError('Unable to fetch user details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-semibold text-red-500">User not found</h2>
      <p className="text-sm text-muted-foreground">The requested user does not exist or there was an issue fetching data.</p>
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:underline"
        >
         Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8 space-y-6"
    >
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </button>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserIcon className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">@{user.username}</p>
              
              <div className="mt-6 w-full space-y-3 border-t pt-6 text-left">
                <div className="flex items-center text-sm">
                  <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Globe className="mr-3 h-4 w-4 text-muted-foreground" />
                  <a 
                    href={user.website ? `https://${user.website}` : '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    {user.website}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 flex items-center font-semibold">
              <Building2 className="mr-2 h-4 w-4 text-primary" />
              Company
            </h3>
            <div className="space-y-2">
              <p className="font-medium">{user.company.name}</p>
              <p className="text-sm text-muted-foreground italic">"{user.company.catchPhrase}"</p>
              <div className="mt-4 flex items-start text-xs text-muted-foreground">
                <Briefcase className="mr-2 h-3 w-3 mt-0.5" />
                <span>{user.company.bs}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm h-full">
            <h3 className="mb-6 flex items-center text-lg font-semibold">
              <MapPin className="mr-2 h-5 w-5 text-primary" />
              Address Details
            </h3>
            
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Street</p>
                <p className="text-base">{user.address.street}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Suite</p>
                <p className="text-base">{user.address.suite}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">City</p>
                <p className="text-base">{user.address.city}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Zipcode</p>
                <p className="text-base">{user.address.zipcode}</p>
              </div>
            </div>

            <div className="mt-10 rounded-xl bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Geographic Coordinates</p>
                  <p className="text-xs text-muted-foreground">Lat: {user.address.geo.lat}, Lng: {user.address.geo.lng}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
