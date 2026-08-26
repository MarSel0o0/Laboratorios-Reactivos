# Preguntas

## Pregunta 1

### ¿Qué es un componente en React? ¿En qué se diferencia de una función común de Typescript?

Un componente en React es una función (o clase) que recibe props como argumento y devuelve JSX (una descripción de UI). React lo llama en su ciclo de render y usa lo que devuelve para construir el DOM.

Diferencias con funciones de typescript:

- Convención de nombre: debe empezar con mayúscula. Si la nombras en minúscula, React la trata como una etiqueta HTML, no como componente.
- Tiene que devolver algo que React pueda renderizar (JSX, string, null, array de eso). Una función común puede devolver cualquier tipo.
- React decide cuándo ejecutar la función (en el render inicial, en cada re-render por cambio de estado o props). No la llamas tú directamente como harías con una función normal.

### ¿Cuál es la diferencia entre props y state? ¿Quién puede modificar cada uno, y qué ocurre en la página cuando cambian?

- Props: datos que un componente recibe desde su padre. Son de solo lectura desde dentro del componente que las recibe — no puedes modificarlas ahí. Solo el padre puede cambiarlas, pasándole un valor distinto en el siguiente render.

- State: datos internos del componente, manejados con useState (u otro hook de estado). Solo ese componente (a través de su función setState/setX) puede modificarlo. Nadie de afuera puede tocarlo directamente.

En ambos casos el efecto visible cundo se actualizan es el mismo: la función del componente se vuelve a ejecutar y el DOM se actualiza. La diferencia es quién dispara el cambio y quién es dueño del dato.

### JSX permite escribir marcado parecido a HTML dentro de un archivo Typescript. ¿Qué diferencia semántica tiene JSX frente a HTML plano? Ejemplifique con className y el uso de { } para insertar expresiones.

HTML es marcado que el navegador parsea directamente, JSX es código que se convierte en JavaScript antes de ejecutarse. El navegador nunca ve JSX; ve el resultado de esas llamadas convertido en llamadas al DOM real.

**className en vez de class:** En HTML usas class="botón". En JSX usas className="boton", porque class es palabra reservada en JavaScript. JSX es JS, no puede usar class como nombre de atributo.

**{ } para insertar expresiones:** En HTML plano no puedes meter lógica ni variables dentro del marcado; es texto estático. En JSX, cualquier cosa entre { } es una expresión de JavaScript evaluada en tiempo de render, y su resultado se inserta ahí.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
