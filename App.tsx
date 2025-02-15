import Storage, {
  SQLiteStorageSetItemUpdateFunction,
} from "expo-sqlite/kv-store";
import { StatusBar } from "expo-status-bar";
import { useAtom } from "jotai";
import { atomWithDefault } from "jotai/utils";
import { Button, StyleSheet, Text, View } from "react-native";

const createStore = (key: string) => {
  return {
    get: async () => await Storage.getItem(key),
    set: async (value: string | SQLiteStorageSetItemUpdateFunction) =>
      await Storage.setItem(key, value),
  };
};

const store = createStore("COUNT_ATOM");

const COUNT_ATOM = atomWithDefault(async (get) => {
  const persist = await store.get();

  if (!persist) {
    return 0;
  }
  return Number(persist);
});

export default function App() {
  const [count, setCount] = useAtom(COUNT_ATOM);
  const handleSetStore = async () => {
    const newCount = count + 1;
    await store.set(`${newCount}`);

    setCount(async () => newCount);
  };
  const handleReset = async () => {
    await store.set("0");

    setCount(async () => 0);
  };
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Text>COUNT_ATOM:{count}</Text>
      <Button title="SET COUNTER" onPress={handleSetStore}></Button>
      <Button title="RESET COUNTER" onPress={handleReset}></Button>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
