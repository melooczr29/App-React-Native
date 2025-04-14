import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVS_STORAGE_KEY = "minhas_unis_favoritas";

interface ApiUniversity {
  name: string;
  country: string;
  web_pages: string[];
}

interface SavedUniversity {
  nome: string;
  url: string;
}

export default function SearchScreen() {
  const [countryInput, setCountryInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [universityList, setUniversityList] = useState<ApiUniversity[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const fetchUniversities = async () => {
    Keyboard.dismiss();
    if (!countryInput.trim() && !nameInput.trim()) {
      Alert.alert("Atenção", "Digite um país ou nome de universidade.");
      return;
    }

    setLoadingData(true);
    setUniversityList([]);
    setSearchPerformed(false);

    const countryParam = countryInput.trim()
      ? `country=${encodeURIComponent(countryInput.trim())}`
      : "";
    const nameParam = nameInput.trim()
      ? `name=${encodeURIComponent(nameInput.trim())}`
      : "";
    const queryParams = [countryParam, nameParam].filter(Boolean).join("&");
    const apiUrl = `http://universities.hipolabs.com/search?${queryParams}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Falha ao buscar dados. Tente novamente.");
      }
      const data: ApiUniversity[] = await response.json();
      setUniversityList(data);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível conectar à API.");
      setUniversityList([]);
    } finally {
      setLoadingData(false);
      setSearchPerformed(true);
    }
  };

  const saveFavorite = async (uni: ApiUniversity) => {
    if (!uni.web_pages || uni.web_pages.length === 0 || !uni.web_pages[0]) {
      Alert.alert(
        "Sem Link",
        `"${uni.name}" não tem um site válido para salvar.`
      );
      return;
    }

    const newFav: SavedUniversity = {
      nome: uni.name,
      url: uni.web_pages[0],
    };

    try {
      const currentFavsJson = await AsyncStorage.getItem(FAVS_STORAGE_KEY);
      let currentFavs: SavedUniversity[] = currentFavsJson
        ? JSON.parse(currentFavsJson)
        : [];

      currentFavs.push(newFav);

      await AsyncStorage.setItem(FAVS_STORAGE_KEY, JSON.stringify(currentFavs));
      Alert.alert("Salvo!", `"${newFav.nome}" adicionada às favoritas.`);
      router.push("/favoritos");
    } catch (e) {
      Alert.alert("Erro ao Salvar", "Não foi possível guardar a universidade.");
    }
  };

  const renderUniItem = ({ item }: { item: ApiUniversity }) => (
    <TouchableOpacity onPress={() => saveFavorite(item)}>
      <View style={styles.listItem}>
        <Text style={styles.uniName}>{item.name}</Text>
        <Text style={styles.uniCountry}>{item.country}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.mainContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="País"
          value={countryInput}
          onChangeText={setCountryInput}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Nome da Universidade"
          value={nameInput}
          onChangeText={setNameInput}
        />

        <View style={styles.buttonArea}>
          <Button
            title={loadingData ? "Buscando..." : "Buscar"}
            onPress={fetchUniversities}
            disabled={loadingData}
            color="#4CAF50"
          />
          <View style={{ marginTop: 10 }}>
            <Link href="/favoritos" asChild>
              <Button title="Ver Favoritas" color="#FF9800" />
            </Link>
          </View>
        </View>

        {loadingData && (
          <View style={styles.statusArea}>
            <ActivityIndicator size="small" color="#4CAF50" />
            <Text style={styles.statusText}>Carregando...</Text>
          </View>
        )}

        {!loadingData && searchPerformed && universityList.length === 0 && (
          <View style={styles.statusArea}>
            <Text style={styles.statusText}>
              Nenhuma universidade encontrada com esses termos.
            </Text>
          </View>
        )}

        {!loadingData && universityList.length > 0 && (
          <FlatList
            data={universityList}
            renderItem={renderUniItem}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            style={styles.resultsList}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  inputField: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A5D6A7",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonArea: {
    marginVertical: 15,
  },
  statusArea: {
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  statusText: {
    fontSize: 15,
    color: "#388E3C",
    marginLeft: 8,
  },
  resultsList: {
    marginTop: 15,
    flex: 1,
  },
  listItem: {
    backgroundColor: "#C8E6C9",
    padding: 12,
    marginBottom: 8,
    borderRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },
  uniName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1B5E20",
  },
  uniCountry: {
    fontSize: 14,
    color: "#388E3C",
    marginTop: 3,
  },
});
