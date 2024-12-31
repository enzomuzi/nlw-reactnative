import { useEffect, useState } from "react";
import { View, Text, Alert, ActivityIndicator } from "react-native";

import MapView from "react-native-maps";
import * as Location from "expo-location";

import { api } from "@/services/api";

import { Categories, CategoriesProps } from "@/components/categories";
import { PlaceProps } from "@/components/place";
import { Places } from "@/components/places";

type MarketProps = PlaceProps;

type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export default function Home() {
  const [categories, setCategories] = useState<CategoriesProps>([]);
  const [category, setCategory] = useState("");
  const [markets, setMarkets] = useState<MarketProps[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(
    null
  );
  const [loadingLocation, setLoadingLocation] = useState(true);

  async function fetchCategories() {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
      setCategory(data[0].id);
    } catch (error) {
      console.log(error);
      Alert.alert("Categorias", "Não foi possível carregar as categorias.");
    }
  }

  async function fetchMarkets() {
    try {
      if (!category) {
        return;
      }

      const { data } = await api.get("/markets/category/" + category);
      setMarkets(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Locais", "Não foi possível carregar os locais.");
    }
  }

  async function getCurrentLocation() {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();

      if (granted) {
        const { coords } = await Location.getCurrentPositionAsync();
        setCurrentLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        Alert.alert(
          "Permissão Negada",
          "Não foi possível obter a localização."
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Houve um problema ao obter a localização.");
    } finally {
      setLoadingLocation(false);
    }
  }

  useEffect(() => {
    getCurrentLocation();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [category]);

  if (loadingLocation) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando localização...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Categories
        data={categories}
        onSelect={setCategory}
        selected={category}
      />

      {currentLocation && (
        <MapView style={{ flex: 1 }} initialRegion={currentLocation} />
      )}

      <Places data={markets} />
    </View>
  );
}
