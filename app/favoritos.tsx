import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, router } from "expo-router";

const FAVS_STORAGE_KEY = "minhas_unis_favoritas";

interface SavedUniversity {
  nome: string;
  url: string;
}

export default function FavoritesScreen() {
  const [savedUnis, setSavedUnis] = useState<SavedUniversity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const favsJson = await AsyncStorage.getItem(FAVS_STORAGE_KEY);
      setSavedUnis(favsJson ? JSON.parse(favsJson) : []);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível ler os favoritos.");
      setSavedUnis([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const deleteFavorite = async (uniToRemove: SavedUniversity) => {
    try {
      const currentFavsJson = await AsyncStorage.getItem(FAVS_STORAGE_KEY);
      let currentFavs: SavedUniversity[] = currentFavsJson
        ? JSON.parse(currentFavsJson)
        : [];

      const originalLength = currentFavs.length;

      const updatedFavs = currentFavs.filter(
        (uni) => uni.url !== uniToRemove.url
      );

      if (updatedFavs.length < originalLength) {
        await AsyncStorage.setItem(
          FAVS_STORAGE_KEY,
          JSON.stringify(updatedFavs)
        );

        setSavedUnis(updatedFavs);

        Alert.alert("Removido", `"${uniToRemove.nome}" foi excluído.`);
      } else {
        loadFavorites();
      }
    } catch (e) {
      Alert.alert("Erro", "Não foi possível remover o favorito.");
    }
  };

  const renderFavItem = ({ item }: { item: SavedUniversity }) => (
    <View style={styles.favItemContainer}>
      <View style={styles.favItemText}>
        <Text style={styles.favUrl}>{item.url}</Text>
        <Text style={styles.favName}>{item.nome}</Text>
      </View>
      <TouchableOpacity
        onPress={() => deleteFavorite(item)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.mainContainer}>
        <Button
          title="< Voltar para Busca"
          onPress={() => router.back()}
          color="#FF9800"
        />

        {isLoading && (
          <View style={styles.centeredMessage}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.infoText}>Carregando...</Text>
          </View>
        )}

        {!isLoading && savedUnis.length === 0 && (
          <View style={styles.centeredMessage}>
            <Text style={styles.infoText}>
              Você ainda não salvou nenhuma universidade favorita.
            </Text>
          </View>
        )}

        {!isLoading && savedUnis.length > 0 && (
          <FlatList
            data={savedUnis}
            renderItem={renderFavItem}
            keyExtractor={(item) => item.url}
            style={styles.favList}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#FFF8E1",
  },
  mainContainer: {
    flex: 1,
    padding: 15,
  },
  centeredMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    color: "#FF6F00",
    marginTop: 15,
  },
  favList: {
    marginTop: 20,
  },
  favItemContainer: {
    backgroundColor: "#FFFDE7",
    padding: 10,
    marginBottom: 10,
    borderRadius: 3,
    borderColor: "#FFECB3",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  favItemText: {
    flex: 1,
    marginRight: 10,
  },
  favUrl: {
    fontSize: 15,
    color: "#FFA000",
    fontWeight: "bold",
  },
  favName: {
    fontSize: 13,
    color: "#FFC107",
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: "#FFC107",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
