# Persistencia de Datos en React Native Expo con Jotai y SQLite

Imagina que un usuario introduce preferencias o configura una opción en tu app, pero al reiniciarla, todo se pierde. Esto genera una mala experiencia y puede hacer que los usuarios abandonen la aplicación.

Existen muchas soluciones para manejar la persistencia de datos en React Native, como AsyncStorage, pero hoy te enseñaré a utilizarlo con expo-sqlite y jotai.

## Instalación

```bash
yarn add jotai
yarn add expo-sqlite
```

## Configuración

Vamos a crear una función que recibirá una clave como parámetro y retornará únicamente las funciones que necesitemos. Expo ofrece el uso de SQLite con KV (key-value), que utiliza la base de datos SQLite.

```js
import Storage, {
  SQLiteStorageSetItemUpdateFunction,
} from "expo-sqlite/kv-store";

const createStore = (key: string) => {
  return {
    get: async () => await Storage.getItem(key),
    set: async (value: string | SQLiteStorageSetItemUpdateFunction) =>
      await Storage.setItem(key, value),
  };
};
```

Luego vamos a crear un store.

```js
const store = createStore("COUNT_ATOM");
```

Esto nos permite reutilizar las funciones getItem y setItem sin necesidad de introducir la llave.

## Jotai

Tiene átomos interesantes, como "atomWithDefault", que permite el uso de funciones asíncronas. Esta es una gran ventaja, ya que nos permite preprocesar la función para obtener los datos del store al cargar la aplicación y crear un estado.

```js
import { atomWithDefault } from "jotai/utils";

const store = createStore("COUNT_ATOM");

const COUNT_ATOM = atomWithDefault(async (get) => {
  const persist = await store.get();

  if (!persist) {
    return 0;
  }
  return Number(persist);
});
```

Este átomo se ejecutará solo una vez y, al actualizarlo, no volverá a ejecutar la función de store.get().

Esto es una gran ventaja, ya que significa que, al crear el atomWithDefault, solo estableceremos un átomo con datos por defecto.

## Como Utilizarlo

Simplemente utilizamos el hook useAtom con COUNT_ATOM, lo que nos retorna el valor y la función para actualizar el estado del átomo.

Para actualizarlo, podemos crear funciones que modifiquen tanto el store como el state.

```js
import { useAtom } from "jotai";

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
```

Entonces, cada vez que recargas la aplicación, los datos del store se obtienen durante el proceso de construcción y no durante la ejecución del render del componente. Esto evita el efecto visual donde el estado cambia durante la primera renderización del componente.

¡Gracias por leer!

Espero que esta guía te haya sido de gran ayuda. Ha sido un articulo extenso y detallado, y me encantaría que más personas pudieran beneficiarse de esta información. Si te ha gustado, te invito a compartirlo y a darle un "me gusta". ¡Tu apoyo es invaluable y me motiva a seguir creando contenido de calidad!

ツ
