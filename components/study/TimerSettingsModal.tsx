import { Check, X } from "lucide-react-native";
import React, { useState } from "react";
import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { TimerSettings } from "./TimerComponent";

interface TimerSettingsModalProps {
	visible: boolean;
	settings: TimerSettings;
	onSave: (settings: TimerSettings) => void;
	onClose: () => void;
}

export default function TimerSettingsModal({
	visible,
	settings,
	onSave,
	onClose,
}: TimerSettingsModalProps) {
	const [tempSettings, setTempSettings] = useState<TimerSettings>(settings);

	const handleSave = () => {
		onSave(tempSettings);
		onClose();
	};

	const updateSetting = (key: keyof TimerSettings, value: any) => {
		setTempSettings((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={true}
			onRequestClose={onClose}
		>
			<View style={styles.overlay}>
				<View style={styles.modal}>
					{/* Header */}
					<View style={styles.header}>
						<Text style={styles.title}>Timer Settings</Text>
						<TouchableOpacity
							onPress={onClose}
							style={styles.closeButton}
						>
							<X size={24} color="#424754" />
						</TouchableOpacity>
					</View>

					<ScrollView
						style={styles.content}
						showsVerticalScrollIndicator={false}
					>
						{/* Mode Selection */}
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Timer Mode</Text>
							<View style={styles.modeContainer}>
								<TouchableOpacity
									style={[
										styles.modeButton,
										tempSettings.mode === "pomodoro" &&
											styles.modeButtonActive,
									]}
									onPress={() =>
										updateSetting("mode", "pomodoro")
									}
								>
									<Text
										style={[
											styles.modeButtonText,
											tempSettings.mode === "pomodoro" &&
												styles.modeButtonTextActive,
										]}
									>
										Pomodoro
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[
										styles.modeButton,
										tempSettings.mode === "countdown" &&
											styles.modeButtonActive,
									]}
									onPress={() =>
										updateSetting("mode", "countdown")
									}
								>
									<Text
										style={[
											styles.modeButtonText,
											tempSettings.mode === "countdown" &&
												styles.modeButtonTextActive,
										]}
									>
										Countdown
									</Text>
								</TouchableOpacity>
							</View>
						</View>

						{/* Time Settings */}
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>
								Time Settings (minutes)
							</Text>

							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									Focus Duration
								</Text>
								<TextInput
									style={styles.input}
									value={tempSettings.focusDuration.toString()}
									onChangeText={(text) =>
										updateSetting(
											"focusDuration",
											parseInt(text) || 25,
										)
									}
									keyboardType="numeric"
									placeholder="25"
								/>
							</View>

							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									Break Duration
								</Text>
								<TextInput
									style={styles.input}
									value={tempSettings.breakDuration.toString()}
									onChangeText={(text) =>
										updateSetting(
											"breakDuration",
											parseInt(text) || 5,
										)
									}
									keyboardType="numeric"
									placeholder="5"
								/>
							</View>

							{tempSettings.mode === "pomodoro" && (
								<>
									<View style={styles.inputGroup}>
										<Text style={styles.inputLabel}>
											Long Break Duration
										</Text>
										<TextInput
											style={styles.input}
											value={tempSettings.longBreakDuration.toString()}
											onChangeText={(text) =>
												updateSetting(
													"longBreakDuration",
													parseInt(text) || 15,
												)
											}
											keyboardType="numeric"
											placeholder="15"
										/>
									</View>

									<View style={styles.inputGroup}>
										<Text style={styles.inputLabel}>
											Cycles Before Long Break
										</Text>
										<TextInput
											style={styles.input}
											value={tempSettings.cyclesBeforeLongBreak.toString()}
											onChangeText={(text) =>
												updateSetting(
													"cyclesBeforeLongBreak",
													parseInt(text) || 4,
												)
											}
											keyboardType="numeric"
											placeholder="4"
										/>
									</View>

									<View style={styles.inputGroup}>
										<Text style={styles.inputLabel}>
											Total Cycles
										</Text>
										<TextInput
											style={styles.input}
											value={tempSettings.totalCycles.toString()}
											onChangeText={(text) =>
												updateSetting(
													"totalCycles",
													parseInt(text) || 4,
												)
											}
											keyboardType="numeric"
											placeholder="4"
										/>
									</View>
								</>
							)}
						</View>
					</ScrollView>

					{/* Footer */}
					<View style={styles.footer}>
						<TouchableOpacity
							onPress={onClose}
							style={styles.cancelButton}
						>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleSave}
							style={styles.saveButton}
						>
							<Check size={20} color="white" />
							<Text style={styles.saveButtonText}>
								Save Settings
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modal: {
		backgroundColor: "white",
		borderRadius: 20,
		width: "90%",
		maxHeight: "80%",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#f1f5f9",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#1e293b",
	},
	closeButton: {
		padding: 4,
	},
	content: {
		padding: 20,
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#374151",
		marginBottom: 12,
	},
	modeContainer: {
		flexDirection: "row",
		gap: 12,
	},
	modeButton: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#e2e8f0",
		alignItems: "center",
	},
	modeButtonActive: {
		backgroundColor: "#0058be",
		borderColor: "#0058be",
	},
	modeButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#64748b",
	},
	modeButtonTextActive: {
		color: "white",
	},
	inputGroup: {
		marginBottom: 16,
	},
	inputLabel: {
		fontSize: 14,
		fontWeight: "500",
		color: "#374151",
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: "#e2e8f0",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		color: "#1e293b",
	},
	footer: {
		flexDirection: "row",
		padding: 20,
		borderTopWidth: 1,
		borderTopColor: "#f1f5f9",
		gap: 12,
	},
	cancelButton: {
		flex: 1,
		paddingVertical: 12,
		alignItems: "center",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#e2e8f0",
	},
	cancelButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#64748b",
	},
	saveButton: {
		flex: 2,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		borderRadius: 8,
		backgroundColor: "#0058be",
		gap: 8,
	},
	saveButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "white",
	},
});
