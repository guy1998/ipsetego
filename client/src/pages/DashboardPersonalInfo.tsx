import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Link as LinkIcon } from 'lucide-react';
import { Api } from '@/api/api';
import { useToast } from '@/hooks/use-toast';
import PortfolioDashboardLayout from '@/components/PortfolioDashboardLayout';
import ProfilePictureUploader from '@/components/ProfilePictureUploader';

interface PersonalInfo {
  name: string;
  lastname: string;
  phoneNumber: string;
  address: string;
  birthday: string;
}

interface Language {
  id: string;
  name: string;
  level: number; // 1-5
}

interface Hobby {
  id: string;
  name: string;
}

interface SocialLinks {
  linkedin: string;
  github: string;
  xing: string;
  twitter: string;
  instagram: string;
  youtube: string;
  tiktok: string;
}

const DashboardPersonalInfo = () => {
  const api = Api.getInstance();
  const { toast } = useToast();

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    lastname: '',
    phoneNumber: '',
    address: '',
    birthday: '',
  });
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);

  // Languages State
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isAddLanguageDialogOpen, setIsAddLanguageDialogOpen] = useState(false);
  const [newLanguageName, setNewLanguageName] = useState('');
  const [newLanguageLevel, setNewLanguageLevel] = useState(3);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [isEditLanguageDialogOpen, setIsEditLanguageDialogOpen] = useState(false);
  const [editLanguageName, setEditLanguageName] = useState('');
  const [editLanguageLevel, setEditLanguageLevel] = useState(3);
  const [isSavingLanguage, setIsSavingLanguage] = useState(false);

  // Hobbies State
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [isAddHobbyDialogOpen, setIsAddHobbyDialogOpen] = useState(false);
  const [newHobbyName, setNewHobbyName] = useState('');
  const [editingHobby, setEditingHobby] = useState<Hobby | null>(null);
  const [isEditHobbyDialogOpen, setIsEditHobbyDialogOpen] = useState(false);
  const [editHobbyName, setEditHobbyName] = useState('');
  const [isSavingHobby, setIsSavingHobby] = useState(false);

  // Social Links State
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    linkedin: '',
    github: '',
    xing: '',
    twitter: '',
    instagram: '',
    youtube: '',
    tiktok: '',
  });
  const [isEditingSocial, setIsEditingSocial] = useState(false);
  const [isSavingSocial, setIsSavingSocial] = useState(false);

  // Current User State
  const [currentUser, setCurrentUser] = useState<{ id: string; pictureId?: string } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data on mount
  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/user/profile');
      if (response.data.data) {
        const user = response.data.data;
        setCurrentUser({
          id: user.id,
          pictureId: user.pictureId || undefined,
        });
        setPersonalInfo({
          name: user.name || '',
          lastname: user.lastname || '',
          phoneNumber: user.phoneNumber || '',
          address: user.address || '',
          birthday: user.birthday ? user.birthday.split('T')[0] : '',
        });
        setSocialLinks({
          linkedin: user.linkedin || '',
          github: user.github || '',
          xing: user.xing || '',
          twitter: user.twitter || '',
          instagram: user.instagram || '',
          youtube: user.youtube || '',
          tiktok: user.tiktok || '',
        });
        
        // Handle languages (now JSON with level)
        if (Array.isArray(user.languages)) {
          setLanguages(
            user.languages.map((lang: any, idx: number) => ({
              id: typeof lang === 'string' ? `lang-${idx}` : (lang.id || `lang-${idx}`),
              name: typeof lang === 'string' ? lang : (lang.name || ''),
              level: typeof lang === 'string' ? 3 : (lang.level || 3),
            }))
          );
        }
        if (Array.isArray(user.hobbies)) {
          setHobbies(
            user.hobbies.map((hobby: string, idx: number) => ({
              id: `hobby-${idx}`,
              name: hobby,
            }))
          );
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load personal information',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [api, toast]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Save personal info
  const handleSavePersonalInfo = async () => {
    if (!personalInfo.name || !personalInfo.lastname) {
      toast({
        title: 'Validation Error',
        description: 'Name and surname are required',
        variant: 'destructive',
      });
      return;
    }

    setIsSavingPersonal(true);
    try {
      const response = await api.put('/user/update/self', {
        name: personalInfo.name,
        lastname: personalInfo.lastname,
        phoneNumber: personalInfo.phoneNumber,
        address: personalInfo.address,
        birthday: personalInfo.birthday,
      });
      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Personal information updated successfully',
        });
        setIsEditingPersonal(false);
      }
    } catch (error) {
      console.error('Error updating personal info:', error);
      toast({
        title: 'Error',
        description: 'Failed to update personal information',
        variant: 'destructive',
      });
    } finally {
      setIsSavingPersonal(false);
    }
  };

  // Add language
  const handleAddLanguage = async () => {
    if (!newLanguageName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Language name is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSavingLanguage(true);
    try {
      const updatedLanguages = [...languages, { id: `lang-${Date.now()}`, name: newLanguageName, level: newLanguageLevel }];
      const response = await api.put('/user/update/self', {
        languages: updatedLanguages,
      });
      if (response.status === 200) {
        setLanguages(updatedLanguages);
        setNewLanguageName('');
        setNewLanguageLevel(3);
        setIsAddLanguageDialogOpen(false);
        toast({
          title: 'Success',
          description: 'Language added successfully',
        });
      }
    } catch (error) {
      console.error('Error adding language:', error);
      toast({
        title: 'Error',
        description: 'Failed to add language',
        variant: 'destructive',
      });
    } finally {
      setIsSavingLanguage(false);
    }
  };

  // Edit language
  const handleEditLanguage = async () => {
    if (!editLanguageName.trim() || !editingLanguage) {
      toast({
        title: 'Validation Error',
        description: 'Language name is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSavingLanguage(true);
    try {
      const updatedLanguages = languages.map((l) =>
        l.id === editingLanguage.id ? { ...l, name: editLanguageName, level: editLanguageLevel } : l
      );
      const response = await api.put('/user/update/self', {
        languages: updatedLanguages,
      });
      if (response.status === 200) {
        setLanguages(updatedLanguages);
        setEditingLanguage(null);
        setIsEditLanguageDialogOpen(false);
        toast({
          title: 'Success',
          description: 'Language updated successfully',
        });
      }
    } catch (error) {
      console.error('Error updating language:', error);
      toast({
        title: 'Error',
        description: 'Failed to update language',
        variant: 'destructive',
      });
    } finally {
      setIsSavingLanguage(false);
    }
  };

  // Delete language
  const handleDeleteLanguage = async (id: string) => {
    try {
      const updatedLanguages = languages.filter((l) => l.id !== id);
      const response = await api.put('/user/update/self', {
        languages: updatedLanguages,
      });
      if (response.status === 200) {
        setLanguages(updatedLanguages);
        toast({
          title: 'Success',
          description: 'Language deleted successfully',
        });
      }
    } catch (error) {
      console.error('Error deleting language:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete language',
        variant: 'destructive',
      });
    }
  };

  // Add hobby
  const handleAddHobby = async () => {
    if (!newHobbyName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Hobby name is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSavingHobby(true);
    try {
      const updatedHobbies = [...hobbies, { id: `hobby-${Date.now()}`, name: newHobbyName }];
      const response = await api.put('/user/update/self', {
        hobbies: updatedHobbies.map((h) => h.name),
      });
      if (response.status === 200) {
        setHobbies(updatedHobbies);
        setNewHobbyName('');
        setIsAddHobbyDialogOpen(false);
        toast({
          title: 'Success',
          description: 'Hobby added successfully',
        });
      }
    } catch (error) {
      console.error('Error adding hobby:', error);
      toast({
        title: 'Error',
        description: 'Failed to add hobby',
        variant: 'destructive',
      });
    } finally {
      setIsSavingHobby(false);
    }
  };

  // Edit hobby
  const handleEditHobby = async () => {
    if (!editHobbyName.trim() || !editingHobby) {
      toast({
        title: 'Validation Error',
        description: 'Hobby name is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSavingHobby(true);
    try {
      const updatedHobbies = hobbies.map((h) =>
        h.id === editingHobby.id ? { ...h, name: editHobbyName } : h
      );
      const response = await api.put('/user/update/self', {
        hobbies: updatedHobbies.map((h) => h.name),
      });
      if (response.status === 200) {
        setHobbies(updatedHobbies);
        setEditingHobby(null);
        setIsEditHobbyDialogOpen(false);
        toast({
          title: 'Success',
          description: 'Hobby updated successfully',
        });
      }
    } catch (error) {
      console.error('Error updating hobby:', error);
      toast({
        title: 'Error',
        description: 'Failed to update hobby',
        variant: 'destructive',
      });
    } finally {
      setIsSavingHobby(false);
    }
  };

  // Delete hobby
  const handleDeleteHobby = async (id: string) => {
    try {
      const updatedHobbies = hobbies.filter((h) => h.id !== id);
      const response = await api.put('/user/update/self', {
        hobbies: updatedHobbies.map((h) => h.name),
      });
      if (response.status === 200) {
        setHobbies(updatedHobbies);
        toast({
          title: 'Success',
          description: 'Hobby deleted successfully',
        });
      }
    } catch (error) {
      console.error('Error deleting hobby:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete hobby',
        variant: 'destructive',
      });
    }
  };

  // Save social links
  const handleSaveSocialLinks = async () => {
    setIsSavingSocial(true);
    try {
      const response = await api.put('/user/update/self', {
        linkedin: socialLinks.linkedin,
        github: socialLinks.github,
        xing: socialLinks.xing,
        twitter: socialLinks.twitter,
        instagram: socialLinks.instagram,
        youtube: socialLinks.youtube,
        tiktok: socialLinks.tiktok,
      });
      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Social links updated successfully',
        });
        setIsEditingSocial(false);
      }
    } catch (error) {
      console.error('Error updating social links:', error);
      toast({
        title: 'Error',
        description: 'Failed to update social links',
        variant: 'destructive',
      });
    } finally {
      setIsSavingSocial(false);
    }
  };

  const handleProfilePictureUploadSuccess = () => {
    fetchUserData();
  };

  if (isLoading) {
    return (
      <PortfolioDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading personal information...</p>
        </div>
      </PortfolioDashboardLayout>
    );
  }

  return (
    <PortfolioDashboardLayout>
      <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Personal Information</h1>
        <p className="text-muted-foreground text-lg">
          Manage your personal details, languages, hobbies, and social links
        </p>
      </div>

      {/* Profile Image Section */}
      <Card className="p-8 border-border/20">
        <div className="flex flex-col items-center justify-center space-y-4">
          {currentUser && (
            <ProfilePictureUploader
              userId={currentUser.id}
              currentPictureId={currentUser.pictureId}
              userName={`${personalInfo.name} ${personalInfo.lastname}`}
              onUploadSuccess={handleProfilePictureUploadSuccess}
            />
          )}
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {personalInfo.name} {personalInfo.lastname}
            </h2>
            <p className="text-muted-foreground">Portfolio Profile</p>
          </div>
        </div>
      </Card>

      {/* Personal Information Card */}
      <Card className="p-6 border-border/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Personal Details</h3>
          {!isEditingPersonal && (
            <Button size="sm" onClick={() => setIsEditingPersonal(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        {isEditingPersonal ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={personalInfo.name}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, name: e.target.value })
                  }
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="lastname">Surname</Label>
                <Input
                  id="lastname"
                  value={personalInfo.lastname}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, lastname: e.target.value })
                  }
                  placeholder="Enter your surname"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={personalInfo.phoneNumber}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, phoneNumber: e.target.value })
                }
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={personalInfo.address}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, address: e.target.value })
                }
                placeholder="Enter your address"
              />
            </div>

            <div>
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                value={personalInfo.birthday}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, birthday: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSavePersonalInfo}
                disabled={isSavingPersonal}
              >
                {isSavingPersonal ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditingPersonal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{personalInfo.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Surname</span>
              <span className="font-medium">{personalInfo.lastname}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Phone Number</span>
              <span className="font-medium">{personalInfo.phoneNumber || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Address</span>
              <span className="font-medium">{personalInfo.address || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Birthday</span>
              <span className="font-medium">{personalInfo.birthday || '—'}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Languages and Hobbies Tabs */}
      <div className="grid grid-cols-1 gap-6">
        <Tabs defaultValue="languages" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="hobbies">Hobbies</TabsTrigger>
          </TabsList>

          {/* Languages Tab */}
          <TabsContent value="languages" className="space-y-4">
            <Card className="p-6 border-border/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Languages</h3>
                <Dialog open={isAddLanguageDialogOpen} onOpenChange={setIsAddLanguageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Language
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Language</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="language-name">Language Name</Label>
                        <Input
                          id="language-name"
                          value={newLanguageName}
                          onChange={(e) => setNewLanguageName(e.target.value)}
                          placeholder="e.g., English, Spanish, Chinese"
                        />
                      </div>
                      <div>
                        <Label htmlFor="language-level">Proficiency Level (1-5)</Label>
                        <Input
                          id="language-level"
                          type="number"
                          min="1"
                          max="5"
                          value={newLanguageLevel}
                          onChange={(e) => setNewLanguageLevel(Math.max(1, Math.min(5, parseInt(e.target.value) || 3)))}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddLanguage}
                          disabled={isSavingLanguage}
                        >
                          {isSavingLanguage ? 'Adding...' : 'Add'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsAddLanguageDialogOpen(false);
                            setNewLanguageName('');
                            setNewLanguageLevel(3);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Edit Language Dialog */}
              <Dialog open={isEditLanguageDialogOpen} onOpenChange={setIsEditLanguageDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Language</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-language-name">Language Name</Label>
                      <Input
                        id="edit-language-name"
                        value={editLanguageName}
                        onChange={(e) => setEditLanguageName(e.target.value)}
                        placeholder="e.g., English, Spanish, Chinese"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-language-level">Proficiency Level (1-5)</Label>
                      <Input
                        id="edit-language-level"
                        type="number"
                        min="1"
                        max="5"
                        value={editLanguageLevel}
                        onChange={(e) => setEditLanguageLevel(Math.max(1, Math.min(5, parseInt(e.target.value) || 3)))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleEditLanguage}
                        disabled={isSavingLanguage}
                      >
                        {isSavingLanguage ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditLanguageDialogOpen(false);
                          setEditingLanguage(null);
                          setEditLanguageName('');
                          setEditLanguageLevel(3);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {languages.length > 0 ? (
                <div className="space-y-2">
                  {languages.map((language) => (
                    <div
                      key={language.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{language.name}</span>
                        <Badge variant="secondary">Level {language.level}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingLanguage(language);
                            setEditLanguageName(language.name);
                            setEditLanguageLevel(language.level);
                            setIsEditLanguageDialogOpen(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteLanguage(language.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No languages added yet
                </p>
              )}
            </Card>
          </TabsContent>

          {/* Hobbies Tab */}
          <TabsContent value="hobbies" className="space-y-4">
            <Card className="p-6 border-border/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Hobbies</h3>
                <Dialog open={isAddHobbyDialogOpen} onOpenChange={setIsAddHobbyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Hobby
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Hobby</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="hobby-name">Hobby Name</Label>
                        <Input
                          id="hobby-name"
                          value={newHobbyName}
                          onChange={(e) => setNewHobbyName(e.target.value)}
                          placeholder="e.g., Photography, Gaming, Reading"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddHobby}
                          disabled={isSavingHobby}
                        >
                          {isSavingHobby ? 'Adding...' : 'Add'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsAddHobbyDialogOpen(false);
                            setNewHobbyName('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Edit Hobby Dialog */}
              <Dialog open={isEditHobbyDialogOpen} onOpenChange={setIsEditHobbyDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Hobby</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-hobby-name">Hobby Name</Label>
                      <Input
                        id="edit-hobby-name"
                        value={editHobbyName}
                        onChange={(e) => setEditHobbyName(e.target.value)}
                        placeholder="e.g., Photography, Gaming, Reading"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleEditHobby}
                        disabled={isSavingHobby}
                      >
                        {isSavingHobby ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditHobbyDialogOpen(false);
                          setEditingHobby(null);
                          setEditHobbyName('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {hobbies.length > 0 ? (
                <div className="space-y-2">
                  {hobbies.map((hobby) => (
                    <div
                      key={hobby.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <span className="font-medium">{hobby.name}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingHobby(hobby);
                            setEditHobbyName(hobby.name);
                            setIsEditHobbyDialogOpen(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteHobby(hobby.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No hobbies added yet
                </p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Social Links Card */}
      <Card className="p-6 border-border/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Social Links
          </h3>
          {!isEditingSocial && (
            <Button size="sm" onClick={() => setIsEditingSocial(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        {isEditingSocial ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={socialLinks.linkedin}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                }
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                value={socialLinks.github}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, github: e.target.value })
                }
                placeholder="https://github.com/yourprofile"
              />
            </div>

            <div>
              <Label htmlFor="xing">Xing URL</Label>
              <Input
                id="xing"
                value={socialLinks.xing}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, xing: e.target.value })
                }
                placeholder="https://xing.com/profile/yourprofile"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="twitter">Twitter / X URL</Label>
                <Input
                  id="twitter"
                  value={socialLinks.twitter}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, twitter: e.target.value })
                  }
                  placeholder="https://x.com/yourhandle"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input
                  id="instagram"
                  value={socialLinks.instagram}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, instagram: e.target.value })
                  }
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="youtube">YouTube URL</Label>
                <Input
                  id="youtube"
                  value={socialLinks.youtube}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, youtube: e.target.value })
                  }
                  placeholder="https://youtube.com/@yourchannel"
                />
              </div>
              <div>
                <Label htmlFor="tiktok">TikTok URL</Label>
                <Input
                  id="tiktok"
                  value={socialLinks.tiktok}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, tiktok: e.target.value })
                  }
                  placeholder="https://tiktok.com/@yourhandle"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSaveSocialLinks}
                disabled={isSavingSocial}
              >
                {isSavingSocial ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditingSocial(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">LinkedIn</span>
              <span className="font-medium text-sm break-all">
                {socialLinks.linkedin ? (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {socialLinks.linkedin}
                  </a>
                ) : (
                  '—'
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">GitHub</span>
              <span className="font-medium text-sm break-all">
                {socialLinks.github ? (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {socialLinks.github}
                  </a>
                ) : (
                  '—'
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Xing</span>
              <span className="font-medium text-sm break-all">
                {socialLinks.xing ? (
                  <a
                    href={socialLinks.xing}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {socialLinks.xing}
                  </a>
                ) : (
                  '—'
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Twitter / X</span>
              <span className="font-medium text-sm break-all">
                {socialLinks.twitter ? (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {socialLinks.twitter}
                  </a>
                ) : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">Instagram</span>
              <span className="font-medium text-sm break-all">
                {socialLinks.instagram ? (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {socialLinks.instagram}
                  </a>
                ) : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/20">
              <span className="text-muted-foreground">YouTube</span>
              <span className="font-medium text-sm break-all">
                {socialLinks.youtube ? (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {socialLinks.youtube}
                  </a>
                ) : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">TikTok</span>
              <span className="font-medium text-sm break-all">
                {socialLinks.tiktok ? (
                  <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {socialLinks.tiktok}
                  </a>
                ) : '—'}
              </span>
            </div>
          </div>
        )}
      </Card>
      </div>
    </PortfolioDashboardLayout>
  );
};

export default DashboardPersonalInfo;
