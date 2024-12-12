import { ActivityIndicator } from "react-native";

import { s } from "./styles";
import { colors } from "@/styles/colors";

export function Loading() {
  return <ActivityIndicator style={s.container} color={colors.green.base} />;
}
