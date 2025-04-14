import { Stack } from "expo-router";
import React from "react";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#4CAF50" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Buscar Universidades" }} />
      <Stack.Screen name="favoritos" options={{ title: "Minhas Favoritas" }} />
      <Stack.Screen name="+not-found" options={{ title: "Erro 404" }} />
    </Stack>
  );
}
