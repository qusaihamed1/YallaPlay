import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors";

type FormValues = {
  note: string;
};

export default function HookFormDemo() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { note: "" },
  });

  const onSubmit = (values: FormValues) => {
    Alert.alert("Saved", values.note);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>React Hook Form Demo</Text>
      <Controller
        control={control}
        name="note"
        rules={{ required: "Please write a note" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Write a note about your booking"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />
      {errors.note && <Text style={styles.error}>{errors.note.message}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Save Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  title: {
    fontWeight: "800",
    marginBottom: 10,
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 10,
  },
  error: {
    color: "#B00020",
    marginTop: 6,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
  },
});
