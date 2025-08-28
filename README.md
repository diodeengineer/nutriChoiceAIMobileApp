# NutriChoice

**NutriChoice** is a smart mobile application that recognizes food items using AI and helps users track their daily nutritional intake. Built with **React Native Expo** and **TensorFlow.js**, it offers a modern, user-friendly interface for health-conscious users.


> ⚡ **Hackathon Project:** Developed as part of a **Devpost Hackathon**.
---

## Features

- **Food Recognition via Camera or Gallery**
  - Snap a picture or pick an image from your gallery.
  - AI-powered model predicts the food item and provides confidence percentage.

- **Nutritional Information**
  - Displays calories, protein, carbs, and fat per serving for recognized dishes.

- **Daily Log**
  - Save food items to a daily log to track calorie and nutrient intake.

- **Profile Setup**
  - Set weight, height, age, gender, and activity level.
  - Calculates personalized daily goals for calories, protein, and carbs.

- **Dark Mode Interface**
  - Clean, minimalistic design with a dark background for comfortable usage.

---

## Screenshots

![6161104752339963527](https://github.com/user-attachments/assets/449a5706-6a5a-4f57-b061-6818b92fca6d)

![6161104752339963528](https://github.com/user-attachments/assets/5d79cc05-1b88-4d7a-b0ca-c3557fcabac9)


![6161104752339963529](https://github.com/user-attachments/assets/0cc73d7e-060c-41d5-9a6a-2ec4c99616f2)




---

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:diodeengineer/nutriChoiceAIMobileApp.git
   cd nutriChoiceAIMobileApp
    ```
2. Install dependencies:
   ```bash
   npm install
    ```
3. Start the Expo development server:
   ```bash
   npm start
    ```
4. Run on your device or simulator:
```bash
Scan the QR code with the Expo Go app (iOS/Android).

Or choose the emulator/simulator option.
```

## Tech Stack

| Technology           | Logo |
|---------------------|------|
| React Native + Expo  | <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="32"/> |
| TensorFlow.js        | <img src="https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg" width="32"/> |
| Google Colab         | <img src=""/> |


## Project Structure
```bash
nutriChoiceAIMobileApp/
├── components/
│   ├── CameraScreen.js
│   ├── GalleryPicker.js
│   ├── DailyLogScreen.js
│   └── ProfileScreen.js
├── utils/
│   ├── modelLoader.js
│   ├── modelSingleton.js
│   └── storage.js
├── data/
│   └── dish.json
├── App.js
└── package.json
```
## Future Improvements

Add AI-based portion size estimation.

Include more food items and dishes.

Integrate cloud storage for cross-device daily logs.

Add analytics to visualize nutrition trends over time.

Improve UI/UX with animations and smooth transitions.

Add multi-language support.

## License

This project is MIT licensed.








