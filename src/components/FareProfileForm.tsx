import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Switch,
} from 'react-native';
import { FareProfile } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';

interface Props {
    visible: boolean;
    profile: FareProfile | null; // null = creating new
    currencySymbol: string;
    onSave: (data: Omit<FareProfile, 'id'>) => void;
    onCancel: () => void;
}

export function FareProfileForm({
    visible,
    profile,
    currencySymbol,
    onSave,
    onCancel,
}: Props) {
    const [name, setName] = useState('');
    const [baseFare, setBaseFare] = useState('');
    const [perMileRate, setPerMileRate] = useState('');
    const [waitingRate, setWaitingRate] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    useEffect(() => {
        if (profile) {
            setName(profile.name);
            setBaseFare(profile.baseFare.toString());
            setPerMileRate(profile.perMileRate.toString());
            setWaitingRate(profile.waitingRatePerMinute.toString());
            setIsDefault(profile.isDefault);
        } else {
            setName('');
            setBaseFare('');
            setPerMileRate('');
            setWaitingRate('');
            setIsDefault(false);
        }
    }, [profile, visible]);

    const isValid =
        name.trim().length > 0 &&
        !isNaN(parseFloat(baseFare)) &&
        !isNaN(parseFloat(perMileRate)) &&
        !isNaN(parseFloat(waitingRate)) &&
        parseFloat(baseFare) >= 0 &&
        parseFloat(perMileRate) >= 0 &&
        parseFloat(waitingRate) >= 0;

    const handleSave = () => {
        if (!isValid) return;
        onSave({
            name: name.trim(),
            baseFare: parseFloat(baseFare),
            perMileRate: parseFloat(perMileRate),
            waitingRatePerMinute: parseFloat(waitingRate),
            isDefault,
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.modal}>
                    <Text style={styles.title}>
                        {profile ? 'Edit Profile' : 'New Fare Profile'}
                    </Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>PROFILE NAME</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g. Daytime, Airport"
                            placeholderTextColor={colors.text.muted}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>BASE FARE ({currencySymbol})</Text>
                        <TextInput
                            style={styles.input}
                            value={baseFare}
                            onChangeText={setBaseFare}
                            placeholder="0.00"
                            placeholderTextColor={colors.text.muted}
                            keyboardType="decimal-pad"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>PER MILE RATE ({currencySymbol})</Text>
                        <TextInput
                            style={styles.input}
                            value={perMileRate}
                            onChangeText={setPerMileRate}
                            placeholder="0.00"
                            placeholderTextColor={colors.text.muted}
                            keyboardType="decimal-pad"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>WAITING RATE ({currencySymbol}/MIN)</Text>
                        <TextInput
                            style={styles.input}
                            value={waitingRate}
                            onChangeText={setWaitingRate}
                            placeholder="0.00"
                            placeholderTextColor={colors.text.muted}
                            keyboardType="decimal-pad"
                        />
                    </View>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>Set as default profile</Text>
                        <Switch
                            value={isDefault}
                            onValueChange={setIsDefault}
                            trackColor={{
                                false: colors.background.elevated,
                                true: colors.primary.muted,
                            }}
                            thumbColor={isDefault ? colors.primary.default : colors.text.muted}
                        />
                    </View>

                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.saveBtn, !isValid && styles.saveBtnDisabled]}
                            onPress={handleSave}
                            disabled={!isValid}
                        >
                            <Text style={styles.saveText}>
                                {profile ? 'Update' : 'Create'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modal: {
        backgroundColor: colors.background.secondary,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing['2xl'],
        paddingBottom: spacing['5xl'],
    },
    title: {
        ...typography.h1,
        color: colors.text.primary,
        marginBottom: spacing['2xl'],
    },
    field: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.label,
        color: colors.text.muted,
        marginBottom: spacing.sm,
    },
    input: {
        backgroundColor: colors.background.card,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        color: colors.text.primary,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.border.default,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing['2xl'],
        paddingVertical: spacing.sm,
    },
    switchLabel: {
        ...typography.body,
        color: colors.text.secondary,
    },
    buttons: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    cancelBtn: {
        flex: 1,
        padding: spacing.lg,
        borderRadius: borderRadius.md,
        backgroundColor: colors.background.card,
        alignItems: 'center',
    },
    cancelText: {
        ...typography.button,
        color: colors.text.secondary,
    },
    saveBtn: {
        flex: 1,
        padding: spacing.lg,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary.default,
        alignItems: 'center',
    },
    saveBtnDisabled: {
        opacity: 0.4,
    },
    saveText: {
        ...typography.button,
        color: colors.text.inverse,
    },
});
