import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FareProfile, Preferences } from '../../src/types';
import { colors, spacing, borderRadius, typography } from '../../src/theme';
import { FareProfileCard } from '../../src/components/FareProfileCard';
import { FareProfileForm } from '../../src/components/FareProfileForm';
import { PreferencesForm } from '../../src/components/PreferencesForm';
import * as fareProfileStorage from '../../src/storage/fareProfiles';
import * as preferencesStorage from '../../src/storage/preferences';

export default function SettingsScreen() {
    const [profiles, setProfiles] = useState<FareProfile[]>([]);
    const [preferences, setPreferences] = useState<Preferences>(
        preferencesStorage.DEFAULT_PREFERENCES
    );
    const [formVisible, setFormVisible] = useState(false);
    const [editingProfile, setEditingProfile] = useState<FareProfile | null>(null);

    const loadData = useCallback(async () => {
        const [loadedProfiles, loadedPrefs] = await Promise.all([
            fareProfileStorage.getAllProfiles(),
            preferencesStorage.getPreferences(),
        ]);
        setProfiles(loadedProfiles);
        setPreferences(loadedPrefs);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSaveProfile = async (data: Omit<FareProfile, 'id'>) => {
        if (editingProfile) {
            await fareProfileStorage.updateProfile(editingProfile.id, data);
        } else {
            await fareProfileStorage.saveProfile(data);
        }
        setFormVisible(false);
        setEditingProfile(null);
        loadData();
    };

    const handleEditProfile = (profile: FareProfile) => {
        setEditingProfile(profile);
        setFormVisible(true);
    };

    const handleDeleteProfile = (profile: FareProfile) => {
        if (profiles.length <= 1) {
            Alert.alert('Cannot Delete', 'You need at least one fare profile.');
            return;
        }
        Alert.alert(
            'Delete Profile',
            `Are you sure you want to delete "${profile.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await fareProfileStorage.removeProfile(profile.id);
                        loadData();
                    },
                },
            ]
        );
    };

    const handleSetDefault = async (profile: FareProfile) => {
        await fareProfileStorage.updateProfile(profile.id, { isDefault: true });
        loadData();
    };

    const handleUpdatePreferences = async (updates: Partial<Preferences>) => {
        const updated = await preferencesStorage.updatePreferences(updates);
        setPreferences(updated);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.screenTitle}>Settings</Text>

                {/* Fare Profiles Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Fare Profiles</Text>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => {
                                setEditingProfile(null);
                                setFormVisible(true);
                            }}
                        >
                            <Ionicons name="add" size={20} color={colors.text.inverse} />
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>

                    {profiles.map((profile) => (
                        <FareProfileCard
                            key={profile.id}
                            profile={profile}
                            currencySymbol={preferences.currencySymbol}
                            onEdit={handleEditProfile}
                            onDelete={handleDeleteProfile}
                            onSetDefault={handleSetDefault}
                        />
                    ))}
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.preferencesCard}>
                        <PreferencesForm
                            preferences={preferences}
                            onUpdate={handleUpdatePreferences}
                        />
                    </View>
                </View>

                {/* Bottom padding */}
                <View style={{ height: spacing['5xl'] }} />
            </ScrollView>

            <FareProfileForm
                visible={formVisible}
                profile={editingProfile}
                currencySymbol={preferences.currencySymbol}
                onSave={handleSaveProfile}
                onCancel={() => {
                    setFormVisible(false);
                    setEditingProfile(null);
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.lg,
    },
    screenTitle: {
        ...typography.h1,
        color: colors.text.primary,
        marginBottom: spacing['2xl'],
        marginTop: spacing.lg,
    },
    section: {
        marginBottom: spacing['3xl'],
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        ...typography.h2,
        color: colors.text.primary,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary.default,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        gap: spacing.xs,
    },
    addButtonText: {
        ...typography.caption,
        color: colors.text.inverse,
        fontWeight: '700',
    },
    preferencesCard: {
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
});
