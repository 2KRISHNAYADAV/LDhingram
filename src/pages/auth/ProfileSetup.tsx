import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, Search } from "lucide-react";
import { useAuth } from "@/components/auth/MockAuthProvider";
import logoImage from "@/assets/new-logo.png";

const ProfileSetup = () => {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    profession: "",
    bio: "",
    country: "",
    avatar: null as File | null
  });
  const [searchCountry, setSearchCountry] = useState("");
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const countries = [
    { name: "United States", flag: "🇺🇸" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "France", flag: "🇫🇷" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "India", flag: "🇮🇳" },
    { name: "Brazil", flag: "🇧🇷" },
    { name: "Mexico", flag: "🇲🇽" }
  ];

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchCountry.toLowerCase())
  );

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData(prev => ({ ...prev, avatar: file }));
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save profile and go to home
      handleSaveProfile();
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileData);
      navigate('/');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center p-6 pt-12">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/signup')}
          className="w-10 h-10 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-black ml-4">
          {step === 1 ? "Select Your Country" : step === 2 ? "Fill Your Profile" : "Follow Someone"}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-8">
        {step === 1 && (
          <div className="flex-1">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">Select Your Country</h2>
              <p className="text-gray-600">Choose your country to personalize your experience</p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search country..."
                value={searchCountry}
                onChange={(e) => setSearchCountry(e.target.value)}
                className="pl-12 h-14 rounded-2xl border-2 border-gray-200 focus:border-pink-500"
              />
            </div>

            {/* Country List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredCountries.map((country, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-2xl hover:border-pink-500 cursor-pointer transition-colors"
                  onClick={() => {
                    setProfileData(prev => ({ ...prev, country: country.name }));
                    setStep(2);
                  }}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <span className="text-black font-medium">{country.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">Fill Your Profile</h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  {profileData.avatar ? (
                    <img
                      src={URL.createObjectURL(profileData.avatar)}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-black font-medium">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="h-14 rounded-2xl border-2 border-gray-200 focus:border-pink-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-black font-medium">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={profileData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="h-14 rounded-2xl border-2 border-gray-200 focus:border-pink-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-black font-medium">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="h-14 rounded-2xl border-2 border-gray-200 focus:border-pink-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-black font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-14 rounded-2xl border-2 border-gray-200 focus:border-pink-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-black font-medium">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={profileData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="h-14 rounded-2xl border-2 border-gray-200 focus:border-pink-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession" className="text-black font-medium">Profession</Label>
                <Input
                  id="profession"
                  type="text"
                  placeholder="Enter your profession"
                  value={profileData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  className="h-14 rounded-2xl border-2 border-gray-200 focus:border-pink-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-black font-medium">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="min-h-20 rounded-2xl border-2 border-gray-200 focus:border-pink-500"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">Follow Someone</h2>
              <p className="text-gray-600">Follow people you know to see their posts</p>
            </div>

            {/* Suggested Users */}
            <div className="space-y-4">
              {[
                { name: "John Doe", profession: "Photographer", avatar: "👨‍💼" },
                { name: "Jane Smith", profession: "Designer", avatar: "👩‍🎨" },
                { name: "Mike Johnson", profession: "Developer", avatar: "👨‍💻" },
                { name: "Sarah Wilson", profession: "Artist", avatar: "👩‍🎨" }
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                      {user.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">{user.name}</h3>
                      <p className="text-gray-600 text-sm">{user.profession}</p>
                    </div>
                  </div>
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl px-6">
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="py-6">
          <Button
            onClick={handleNext}
            className="w-full h-14 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-2xl text-lg"
          >
            {step === 3 ? "Get Started" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
