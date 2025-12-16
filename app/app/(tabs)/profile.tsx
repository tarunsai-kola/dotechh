import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import API_URL from '@/constants/config';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';


export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    // Core Profile State
    const [displayName, setDisplayName] = useState('');
    const [headline, setHeadline] = useState('');
    const [about, setAbout] = useState('');
    const [locationCity, setLocationCity] = useState('');
    const [locationCountry, setLocationCountry] = useState('');
    const [mobile, setMobile] = useState('');

    // Modals
    const [skillModalVisible, setSkillModalVisible] = useState(false);
    const [expModalVisible, setExpModalVisible] = useState(false);
    const [eduModalVisible, setEduModalVisible] = useState(false);
    const [resumeModalVisible, setResumeModalVisible] = useState(false);

    // Skill Form
    const [newSkill, setNewSkill] = useState('');
    const [newSkillProficiency, setNewSkillProficiency] = useState('Intermediate');
    const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

    // Experience Form
    const [expForm, setExpForm] = useState({ company: '', position: '', Role: '', startDate: '', endDate: '', description: '', location: '', currentlyWorking: false });
    const [editingExpId, setEditingExpId] = useState<string | null>(null);

    // Education Form
    const [eduForm, setEduForm] = useState({ institution: '', degree: '', field: '', startDate: '', endDate: '', description: '' });
    const [editingEduId, setEditingEduId] = useState<string | null>(null);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${API_URL}/profile/me`);
            const data = response.data;
            if (data.status === 'success') {
                const p = data.profile;
                setProfile(p);
                setDisplayName(p.fullName || p.displayName || '');
                setHeadline(p.headline || '');
                setAbout(p.bio || p.about || '');
                setLocationCity(p.location?.city || '');
                setLocationCountry(p.location?.country || '');
                setMobile(p.mobile || '');
            }
        } catch (error) {
            console.error('Fetch profile error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSaveProfile = async () => {
        try {
            const updatePayload = {
                fullName: displayName,
                headline,
                bio: about,
                location: { city: locationCity, country: locationCountry },
                mobile,
                skills: profile?.skills || []
            };

            const response = await axios.post(`${API_URL}/profile`, updatePayload);
            if (response.data.status === 'success') {
                setEditing(false);
                fetchProfile();
                Alert.alert('Success', 'Profile updated');
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const openSkillModal = (skill: any = null) => {
        if (skill) {
            setEditingSkillId(skill._id);
            setNewSkill(skill.name);
            setNewSkillProficiency(skill.proficiency || 'Intermediate');
        } else {
            setEditingSkillId(null);
            setNewSkill('');
            setNewSkillProficiency('Intermediate');
        }
        setSkillModalVisible(true);
    };

    const handleSaveSkill = async () => {
        if (!newSkill.trim()) return;

        try {
            if (editingSkillId) {
                await axios.put(`${API_URL}/profile/skills/${editingSkillId}`, { name: newSkill, proficiency: newSkillProficiency });
            } else {
                await axios.post(`${API_URL}/profile/skills`, { name: newSkill, proficiency: newSkillProficiency });
            }
            setNewSkill('');
            setNewSkillProficiency('Intermediate');
            setSkillModalVisible(false);
            fetchProfile();
        } catch (error) {
            Alert.alert('Error', 'Failed to save skill');
        }
    };

    const handleDeleteSkill = async () => {
        if (!editingSkillId) return;
        Alert.alert('Delete Skill', 'Are you sure you want to delete this skill?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await axios.delete(`${API_URL}/profile/skills/${editingSkillId}`);
                        setSkillModalVisible(false);
                        fetchProfile();
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete skill');
                    }
                }
            }
        ]);
    };

    const openExpModal = (exp: any = null) => {
        if (exp) {
            setEditingExpId(exp._id);
            setExpForm({
                company: exp.company,
                position: exp.position,
                Role: exp.Role || '',
                startDate: exp.startDate,
                endDate: exp.endDate,
                description: exp.description || '',
                location: exp.location || '',
                currentlyWorking: exp.currentlyWorking || false
            });
        } else {
            setEditingExpId(null);
            setExpForm({ company: '', position: '', Role: '', startDate: '', endDate: '', description: '', location: '', currentlyWorking: false });
        }
        setExpModalVisible(true);
    };

    const handleSaveExperience = async () => {
        try {
            if (editingExpId) {
                await axios.put(`${API_URL}/profile/experience/${editingExpId}`, expForm);
            } else {
                await axios.post(`${API_URL}/profile/experience`, expForm);
            }
            setExpModalVisible(false);
            setExpForm({ company: '', position: '', Role: '', startDate: '', endDate: '', description: '', location: '', currentlyWorking: false });
            fetchProfile();
        } catch (error) {
            Alert.alert('Error', 'Failed to save experience');
        }
    };

    const openEduModal = (edu: any = null) => {
        if (edu) {
            setEditingEduId(edu._id);
            setEduForm({
                institution: edu.institution,
                degree: edu.degree,
                field: edu.field,
                startDate: edu.startDate,
                endDate: edu.endDate,
                description: edu.description || ''
            });
        } else {
            setEditingEduId(null);
            setEduForm({ institution: '', degree: '', field: '', startDate: '', endDate: '', description: '' });
        }
        setEduModalVisible(true);
    };

    const handleSaveEducation = async () => {
        try {
            if (editingEduId) {
                await axios.put(`${API_URL}/profile/education/${editingEduId}`, eduForm);
            } else {
                await axios.post(`${API_URL}/profile/education`, eduForm);
            }
            setEduModalVisible(false);
            setEduForm({ institution: '', degree: '', field: '', startDate: '', endDate: '', description: '' });
            fetchProfile();
        } catch (error) {
            Alert.alert('Error', 'Failed to save education');
        }
    };

    const handleDeleteExperience = async () => {
        if (!editingExpId) return;
        Alert.alert('Delete Experience', 'Are you sure you want to delete this experience?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await axios.delete(`${API_URL}/profile/experience/${editingExpId}`);
                        setExpModalVisible(false);
                        fetchProfile();
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete experience');
                    }
                }
            }
        ]);
    };

    const handleDeleteEducation = async () => {
        if (!editingEduId) return;
        Alert.alert('Delete Education', 'Are you sure you want to delete this education?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await axios.delete(`${API_URL}/profile/education/${editingEduId}`);
                        setEduModalVisible(false);
                        fetchProfile();
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete education');
                    }
                }
            }
        ]);
    };

    const handleGeneratePDF = async () => {
        const htmlContent = `
             <!DOCTYPE html>
            <html>
            <head>
                <style>
                    @page { size: A4; margin: 0.75in; }
                    body { font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #000; }
                    .container { width: 100%; max-width: 100%; }
                    h1 { font-size: 26px; margin-bottom: 5px; color: #000; text-align: center; text-transform: uppercase; letter-spacing: 1px; }
                    .headline { font-size: 14px; color: #666; margin-bottom: 15px; text-align: center; }
                    .contact { font-size: 11px; color: #666; margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 15px; text-align: center; }
                    .section { margin-bottom: 25px; page-break-inside: avoid; }
                    .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 4px; margin-bottom: 10px; color: #000; letter-spacing: 0.5px; }
                    .item { margin-bottom: 12px; page-break-inside: avoid; }
                    .item-header { display: flex; justify-content: space-between; margin-bottom: 2px; }
                    .item-title { font-weight: bold; font-size: 14px; color: #000; }
                    .item-date { color: #666; font-size: 12px; }
                    .item-subtitle { font-style: italic; color: #444; font-size: 12px; margin-bottom: 4px; }
                    .skills { line-height: 1.6; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>${profile?.fullName || ''}</h1>
                    <div class="headline">${profile?.headline || ''}</div>
                    <div class="contact">
                        ${profile?.userId?.email || ''} ${profile?.mobile ? `• ${profile.mobile}` : ''} • ${profile?.location?.city ? `${profile.location.city}, ${profile.location.country}` : ''}
                    </div>

                    ${(profile?.bio || profile?.about) ? `
                    <div class="section">
                        <div class="section-title">Summary</div>
                        <div>${profile.bio || profile.about}</div>
                    </div>` : ''}

                    ${profile?.skills?.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Skills</div>
                        <div class="skills">
                            ${profile.skills.map((s: any) => {
            return `<span>${s.name} <span style="color: #666; font-size: 11px;">(${s.proficiency || 'Intermediate'})</span></span>`;
        }).join('<span style="margin: 0 8px; color: #999;">|</span>')}
                        </div>
                    </div>` : ''}

                    ${profile?.experience?.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Experience</div>
                        ${profile.experience.map((exp: any) => `
                            <div class="item">
                                <div class="item-header">
                                    <span class="item-title">${exp.position}</span>
                                    <span class="item-date">${exp.startDate} - ${exp.endDate || 'Present'}</span>
                                </div>
                                <div class="item-subtitle">${exp.company}</div>
                                ${exp.Role ? `<div style="font-size: 13px; color: #555; margin-top: 2px;">${exp.Role}</div>` : ''}
                                ${exp.description ? `<div style="font-size: 13px; color: #666; margin-top: 4px;">${exp.description}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>` : ''}

                    ${profile?.education?.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Education</div>
                         ${profile.education.map((edu: any) => `
                            <div class="item">
                                <div class="item-header">
                                    <span class="item-title">${edu.institution}</span>
                                    <span class="item-date">${edu.startDate} - ${edu.endDate || 'Present'}</span>
                                </div>
                                <div class="item-subtitle">${edu.degree} in ${edu.field}</div>
                            </div>
                        `).join('')}
                    </div>` : ''}
                </div>
            </body>
            </html>
        `;

        try {
            const { uri } = await Print.printToFileAsync({ html: htmlContent });
            console.log('PDF Generated at:', uri);
            await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } catch (error: any) {
            console.error('PDF Generation Error:', error);
            Alert.alert('Error', 'Failed to generate PDF: ' + (error.message || 'Unknown error'));
        }
    };



    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0EA5E9" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Profile Header */}
                <View style={styles.card}>
                    <View style={styles.headerTop}>
                        <View style={styles.avatarContainer}>
                            {profile?.avatarUrl ? (
                                <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                    <Text style={styles.avatarText}>{profile?.fullName?.charAt(0) || 'U'}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {editing ? (
                        <View style={styles.formGap}>
                            <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} placeholder="Full Name" />
                            <TextInput style={styles.input} value={headline} onChangeText={setHeadline} placeholder="Headline" />
                            <View style={styles.row}>
                                <TextInput style={[styles.input, { flex: 1 }]} value={locationCity} onChangeText={setLocationCity} placeholder="City" />
                                <TextInput style={[styles.input, { flex: 1 }]} value={locationCountry} onChangeText={setLocationCountry} placeholder="Country" />
                            </View>
                            <TextInput style={styles.input} value={mobile} onChangeText={setMobile} placeholder="Mobile Number" keyboardType="phone-pad" />
                            <TextInput style={[styles.input, styles.textArea]} value={about} onChangeText={setAbout} placeholder="About" multiline />
                        </View>
                    ) : (
                        <View>
                            <Text style={styles.name}>{profile?.fullName || 'User Name'}</Text>
                            <Text style={styles.headline}>{profile?.headline || 'No headline'}</Text>
                            <Text style={styles.location}>{profile?.location?.city || ''} {profile?.location?.country || ''}</Text>
                            <Text style={styles.about}>{profile?.bio || profile?.about || ''}</Text>
                        </View>
                    )}

                    {/* Action Buttons Row */}
                    {!editing && (
                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
                            <TouchableOpacity style={styles.actionBtnPrimary} onPress={() => setResumeModalVisible(true)}>
                                <Ionicons name="document-text-outline" size={20} color="#FFFFFF" />
                                <Text style={styles.actionBtnTextPrimary}>Resume</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtnSecondary} onPress={() => setEditing(true)}>
                                <Ionicons name="create-outline" size={20} color="#94A3B8" />
                                <Text style={styles.actionBtnTextSecondary}>Edit Profile</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {editing && (
                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
                            <TouchableOpacity style={styles.actionBtnPrimary} onPress={handleSaveProfile}>
                                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                <Text style={styles.actionBtnTextPrimary}>Save Changes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtnSecondary} onPress={() => setEditing(false)}>
                                <Ionicons name="close" size={20} color="#94A3B8" />
                                <Text style={styles.actionBtnTextSecondary}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Skills */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <TouchableOpacity onPress={() => openSkillModal()}>
                            <Ionicons name="add-circle" size={24} color="#0EA5E9" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.skillsContainer}>
                        {profile?.skills?.map((s: any, i: number) => (
                            <TouchableOpacity key={i} style={styles.skillChip} onPress={() => openSkillModal(s)}>
                                <Text style={styles.skillText}>
                                    {s.name} • {s.proficiency || 'Intermediate'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Experience */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        <TouchableOpacity onPress={() => openExpModal()}>
                            <Ionicons name="add-circle" size={24} color="#0EA5E9" />
                        </TouchableOpacity>
                    </View>
                    {profile?.experience?.map((exp: any, i: number) => (
                        <View key={i} style={styles.itemBlock}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.itemTitle}>{exp.position}</Text>
                                    <Text style={styles.itemSubtitle}>{exp.company}</Text>
                                    {exp.Role ? <Text style={styles.itemSubtitle}>{exp.Role}</Text> : null}
                                    <Text style={styles.itemDate}>{exp.startDate} - {exp.endDate || 'Present'}</Text>
                                </View>
                                <TouchableOpacity onPress={() => openExpModal(exp)} style={{ padding: 4 }}>
                                    <Ionicons name="create-outline" size={20} color="#64748b" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>


                {/* Education */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        <TouchableOpacity onPress={() => openEduModal()}>
                            <Ionicons name="add-circle" size={24} color="#0EA5E9" />
                        </TouchableOpacity>
                    </View>
                    {profile?.education?.map((edu: any, i: number) => (
                        <View key={i} style={styles.itemBlock}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.itemTitle}>{edu.institution}</Text>
                                    <Text style={styles.itemSubtitle}>{edu.degree} in {edu.field}</Text>
                                    <Text style={styles.itemDate}>{edu.startDate} - {edu.endDate || 'Present'}</Text>
                                </View>
                                <TouchableOpacity onPress={() => openEduModal(edu)} style={{ padding: 4 }}>
                                    <Ionicons name="create-outline" size={20} color="#64748b" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Modals */}
            <Modal visible={skillModalVisible} transparent animationType="slide">
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingSkillId ? 'Edit Skill' : 'Add Skill'}</Text>
                        <TextInput style={styles.input} placeholder="Skill Name (e.g. React)" value={newSkill} onChangeText={setNewSkill} />

                        {/* Proficiency Selection */}
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ color: '#9CA3AF', marginBottom: 8 }}>Proficiency</Text>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                {['Beginner', 'Intermediate', 'Expert'].map((level) => (
                                    <TouchableOpacity
                                        key={level}
                                        onPress={() => setNewSkillProficiency(level)}
                                        style={[
                                            { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#334155' },
                                            newSkillProficiency === level && { backgroundColor: '#0EA5E9', borderColor: '#0EA5E9' }
                                        ]}
                                    >
                                        <Text style={{ color: newSkillProficiency === level ? '#FFF' : '#9CA3AF', fontSize: 13 }}>{level}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.modalFooter}>
                            {editingSkillId && (
                                <TouchableOpacity style={styles.modalBtnDelete} onPress={handleDeleteSkill}>
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            )}
                            <View style={styles.modalBtnGroup}>
                                <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setSkillModalVisible(false)}>
                                    <Text style={styles.btnTextSecondary}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalBtnSave} onPress={handleSaveSkill}>
                                    <Text style={styles.btnTextPrimary}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={expModalVisible} transparent animationType="slide">
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingExpId ? 'Edit Experience' : 'Add Experience'}</Text>
                        <TextInput style={styles.input} placeholder="Company" value={expForm.company} onChangeText={t => setExpForm({ ...expForm, company: t })} />
                        <TextInput style={styles.input} placeholder="Position" value={expForm.position} onChangeText={t => setExpForm({ ...expForm, position: t })} />
                        <TextInput style={styles.input} placeholder="Role" value={expForm.Role} onChangeText={t => setExpForm({ ...expForm, Role: t })} />
                        <View style={styles.row}>
                            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Start Date" value={expForm.startDate} onChangeText={t => setExpForm({ ...expForm, startDate: t })} />
                            <TextInput style={[styles.input, { flex: 1 }]} placeholder="End Date" value={expForm.endDate} onChangeText={t => setExpForm({ ...expForm, endDate: t })} />
                        </View>
                        <View style={styles.modalFooter}>
                            {editingExpId && (
                                <TouchableOpacity style={styles.modalBtnDelete} onPress={handleDeleteExperience}>
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            )}
                            <View style={styles.modalBtnGroup}>
                                <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setExpModalVisible(false)}>
                                    <Text style={styles.btnTextSecondary}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalBtnSave} onPress={handleSaveExperience}>
                                    <Text style={styles.btnTextPrimary}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={eduModalVisible} transparent animationType="slide">
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingEduId ? 'Edit Education' : 'Add Education'}</Text>
                        <TextInput style={styles.input} placeholder="Institution" value={eduForm.institution} onChangeText={t => setEduForm({ ...eduForm, institution: t })} />
                        <TextInput style={styles.input} placeholder="Degree" value={eduForm.degree} onChangeText={t => setEduForm({ ...eduForm, degree: t })} />
                        <TextInput style={styles.input} placeholder="Field of Study" value={eduForm.field} onChangeText={t => setEduForm({ ...eduForm, field: t })} />
                        <View style={styles.row}>
                            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Start Date" value={eduForm.startDate} onChangeText={t => setEduForm({ ...eduForm, startDate: t })} />
                            <TextInput style={[styles.input, { flex: 1 }]} placeholder="End Date" value={eduForm.endDate} onChangeText={t => setEduForm({ ...eduForm, endDate: t })} />
                        </View>
                        <View style={styles.modalFooter}>
                            {editingEduId && (
                                <TouchableOpacity style={styles.modalBtnDelete} onPress={handleDeleteEducation}>
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            )}
                            <View style={styles.modalBtnGroup}>
                                <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setEduModalVisible(false)}>
                                    <Text style={styles.btnTextSecondary}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalBtnSave} onPress={handleSaveEducation}>
                                    <Text style={styles.btnTextPrimary}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Resume Modal */}
            <Modal visible={resumeModalVisible} animationType="slide">
                <SafeAreaView style={{ flex: 1, backgroundColor: '#020617' }}>
                    <View style={styles.resumeHeader}>
                        <TouchableOpacity onPress={() => setResumeModalVisible(false)} style={styles.resumeCloseBtn}>
                            <Ionicons name="close" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.resumeHeaderTitle}>Resume Preview</Text>
                        <TouchableOpacity onPress={handleGeneratePDF} style={styles.resumeCloseBtn}>
                            <Ionicons name="download-outline" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.resumeScroll}>
                        <View style={styles.resumePaper}>
                            {/* Header */}
                            <View style={styles.resumeSection}>
                                <Text style={styles.resumeName}>{profile?.fullName}</Text>
                                <Text style={styles.resumeHeadline}>{profile?.headline}</Text>
                                <View style={styles.resumeContact}>
                                    <Text style={styles.resumeContactText}>{profile?.userId?.email}</Text>
                                    {profile?.mobile ? <Text style={styles.resumeContactText}>• {profile.mobile}</Text> : null}
                                    <Text style={styles.resumeContactText}>•</Text>
                                    <Text style={styles.resumeContactText}>{profile?.location?.city ? `${profile.location.city}, ${profile.location.country}` : 'Location NA'}</Text>
                                </View>
                            </View>

                            <View style={styles.resumeDivider} />

                            {/* Summary */}
                            {(profile?.bio || profile?.about) && (
                                <>
                                    <View style={styles.resumeSection}>
                                        <Text style={styles.resumeSectionTitle}>Summary</Text>
                                        <Text style={styles.resumeText}>{profile?.bio || profile?.about}</Text>
                                    </View>
                                    <View style={styles.resumeDivider} />
                                </>
                            )}

                            {/* Skills - NOW ABOVE EXPERIENCE */}
                            {profile?.skills && profile.skills.length > 0 && (
                                <View style={styles.resumeSection}>
                                    <Text style={styles.resumeSectionTitle}>Skills</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                                        {profile.skills.map((s: any, i: number) => (
                                            <Text key={i} style={styles.resumeText}>
                                                {s.name} <Text style={{ color: '#64748b', fontSize: 13 }}>({s.proficiency || 'Intermediate'})</Text>
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Experience */}
                            {profile?.experience && profile.experience.length > 0 && (
                                <>
                                    <View style={styles.resumeSection}>
                                        <Text style={styles.resumeSectionTitle}>Experience</Text>
                                        {profile.experience.map((exp: any, i: number) => (
                                            <View key={i} style={styles.resumeItem}>
                                                <View style={styles.resumeItemHeader}>
                                                    <Text style={styles.resumeItemTitle}>{exp.position}</Text>
                                                    <Text style={styles.resumeVDate}>{exp.startDate} - {exp.endDate || 'Present'}</Text>
                                                </View>
                                                <Text style={styles.resumeItemSubtitle}>{exp.company}</Text>
                                                {exp.Role ? <Text style={styles.resumeRole}>{exp.Role}</Text> : null}
                                                {exp.description ? <Text style={styles.resumeDesc}>{exp.description}</Text> : null}
                                            </View>
                                        ))}
                                    </View>
                                    <View style={styles.resumeDivider} />
                                </>
                            )}

                            {/* Education */}
                            {profile?.education && profile.education.length > 0 && (
                                <>
                                    <View style={styles.resumeSection}>
                                        <Text style={styles.resumeSectionTitle}>Education</Text>
                                        {profile.education.map((edu: any, i: number) => (
                                            <View key={i} style={styles.resumeItem}>
                                                <View style={styles.resumeItemHeader}>
                                                    <Text style={styles.resumeItemTitle}>{edu.institution}</Text>
                                                    <Text style={styles.resumeVDate}>{edu.startDate} - {edu.endDate || 'Present'}</Text>
                                                </View>
                                                <Text style={styles.resumeItemSubtitle}>{edu.degree} in {edu.field}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </>
                            )}

                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' },
    scrollContent: { padding: 20, gap: 16 },
    card: { backgroundColor: '#0F172A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E293B' },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    avatarContainer: {},
    avatar: { width: 80, height: 80, borderRadius: 40 },
    avatarPlaceholder: { backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 32, fontWeight: 'bold', color: '#0EA5E9' },
    editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1E293B', padding: 8, borderRadius: 8 },
    saveText: { color: '#FFFFFF', fontWeight: '600' },
    formGap: { gap: 12 },
    input: { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', borderRadius: 8, padding: 12, fontSize: 14, color: '#FFFFFF', marginBottom: 8 },
    textArea: { height: 80, textAlignVertical: 'top' },
    row: { flexDirection: 'row', gap: 12 },
    name: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
    headline: { fontSize: 16, color: '#9CA3AF', marginBottom: 4 },
    location: { fontSize: 14, color: '#9CA3AF', marginBottom: 8 },
    about: { fontSize: 14, color: '#9CA3AF', lineHeight: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
    skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    skillChip: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#0EA5E9' },
    skillText: { color: '#0EA5E9', fontWeight: '500', fontSize: 14 },
    itemBlock: { marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
    itemTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
    itemSubtitle: { fontSize: 14, color: '#9CA3AF' },
    itemDate: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
    logoutButton: { backgroundColor: '#0F172A', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#EF4444' },
    logoutText: { color: '#EF4444', fontWeight: 'bold' },

    // Modal
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#0F172A', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1E293B' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#FFFFFF' },

    modalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    modalBtnGroup: { flexDirection: 'row', gap: 12, flex: 1, justifyContent: 'flex-end' },
    modalBtnCancel: { paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center', backgroundColor: 'transparent', borderWidth: 1, borderColor: '#334155', borderRadius: 8 },
    modalBtnSave: { paddingVertical: 10, paddingHorizontal: 24, alignItems: 'center', backgroundColor: '#0EA5E9', borderRadius: 8 },
    modalBtnDelete: { padding: 10, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
    btnTextPrimary: { color: '#fff', fontWeight: '600' },
    btnTextSecondary: { color: '#9CA3AF', fontWeight: '600' },

    // Resume Styles
    resumeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#020617', borderBottomWidth: 1, borderBottomColor: '#1E293B' },
    resumeCloseBtn: { padding: 4 },
    resumeHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
    resumeScroll: { padding: 20 },
    resumePaper: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 2, minHeight: 600, width: '100%', alignSelf: 'center' }, // White paper, A4 aspectish
    resumeSection: { marginBottom: 24 },
    resumeDivider: { height: 1, backgroundColor: '#E2E8F0', marginBottom: 24 },
    resumeName: { fontSize: 28, fontWeight: 'bold', color: '#0F172A', marginBottom: 4, textAlign: 'center' }, // Dark text
    resumeHeadline: { fontSize: 16, color: '#475569', marginBottom: 8, textAlign: 'center' },
    resumeContact: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
    resumeContactText: { fontSize: 14, color: '#64748b' },
    resumeSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, borderBottomWidth: 2, borderBottomColor: '#0F172A', paddingBottom: 4 },
    resumeText: { fontSize: 15, color: '#334155', lineHeight: 24 },
    resumeItem: { marginBottom: 16 },
    resumeItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 },
    resumeItemTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', flex: 1, marginRight: 8 },
    resumeVDate: { fontSize: 14, color: '#64748b', flexShrink: 0 },
    resumeItemSubtitle: { fontSize: 14, color: '#475569', fontStyle: 'italic' },
    resumeRole: { fontSize: 13, color: '#555', marginTop: 2, fontWeight: '500' },
    resumeDesc: { fontSize: 13, color: '#666', marginTop: 4 },

    // Action Buttons
    actionBtnPrimary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#0EA5E9', padding: 12, borderRadius: 12 },
    actionBtnSecondary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1E293B', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
    actionBtnTextPrimary: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
    actionBtnTextSecondary: { color: '#94A3B8', fontWeight: '600', fontSize: 15 },
});

