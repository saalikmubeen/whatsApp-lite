<h1 align="center">WhatsApp Lite</h1>

<p align="center">
<h5>Description: </h5>

<i>This is an open source WhatsApp like mobile chat application created using React Native library maintained by facebook, Expo, and Firebase.</i>
The goal of this project is to build an application with exact features that the original whatsApp application has, however using different tools and approach. This project is not for profit and is used only as an object of study on development.

# Libraries used

-   **`React`** the love of my life
-   **`React Native`** because I love React
-   **`Expo`** for easy development and deployment
-   **`Firebase`** for authentication, realtime database and file storage
-   **`Redux Toolkit`** for state management
-   **`Typescript`** for type safety, cure for headache you get when props are flowing all over the app with no hint
-   **`React Navigation`** for in app navigation

# Features

-   Authentication with email and password
-   Realtime chat with other users
-   Group chat and private chats
-   `Send images` in chat
-   `Reply to individual messages` in chat by taggging the message
-   `Push notifications` for new messages
-   User profile with profile picture
-   Search for other users
-   Leaving group chats
-   Realtime `delete messages for everyone` feature like in WhatsApp
-   `Edit messages` in chat in realtime like in WhatsApp
-   `Upload Status with images like in WhatsApp`
-   `Status views list feature like in WhatsApp`
-   Delete status feature

**and more....**

# Installation

Clone project

```
git clone git@github.com:saalikmubeen/whatsApp-lite.git
```

```
cd whatsApp-lite
```

`npm install` to to install dependencies

`Setup required environment variables for firebase:`

_Make a **`.env`** file inside the root directory with below environment variables_

-   EXPO_PUBLIC_FIREBASE_API_KEY
-   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
-   EXPO_PUBLIC_FIREBASE_PROJECT_ID
-   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
-   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
-   EXPO_PUBLIC_FIREBASE_APP_ID
-   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
-   EXPO_PUBLIC_FIREBASE_DATABASE_URL

`npm start` to start the expo development server.

Press `a` to run the app on android emulator or `i` to run on ios simulator. Or scan the QR code in the terminal with your phone using the expo go app if you want to run the app on your physical phone.

# Firebase Realtime Database Structure

```json
{
	"chats": {
		"-Nf5ZzwUeq65P3AiRRU5": {
			"createdAt": "2023-09-24T09:45:02.472Z",
			"createdBy": "uGXHAC1NSpYLQMsJTUTp8ybcinn2",
			"isGroupChat": false,
			"latestMessageText": "Hey",
			"updatedAt": "2023-09-24T09:45:03.599Z",
			"updatedBy": "uGXHAC1NSpYLQMsJTUTp8ybcinn2",
			"users": ["uGXHAC1NSpYLQMsJTUTp8ybcinn2", "nt976zd2b4PwasT3p8zKJXecyr83"]
		},
		"-Nf5aBln6fGFCBulN_MU": {
			"chatImage": "https://firebasestorage.googleapis.com/v0/b/whatsapp-lite-rn.appspot.com/o/profilePics%2F1ab3dd26-04d5-4eee-a9c5-72bb05d02e7e?alt=media&token=5265a9c8-5f4d-46c2-b077-01b5119e46d7",
			"chatName": "Developers Group",
			"createdAt": "2023-09-24T09:50:17.183Z",
			"createdBy": "uGXHAC1NSpYLQMsJTUTp8ybcinn2",
			"isGroupChat": true,
			"latestMessageText": "tom carson added testt test to the chat",
			"updatedAt": "2023-09-24T10:36:14.032Z",
			"updatedBy": "E5GvJxomD9O1zL3X89jeCbJDdku2",
			"users": [
				"E5GvJxomD9O1zL3X89jeCbJDdku2",
				"iwxL9B4RBYU1Ez4CH0lu7uEr4jp2",
				"nt976zd2b4PwasT3p8zKJXecyr83",
				"O7GWktcZPbWhtzuXQERfPNvZdEw1",
				"jKOZEThVqeM6JTRZrW1B2UWPWkt1",
				"f9mcEU3MgrQaWEU3sQUzzeiPcBU2",
				"Pg4EpioqIHSkM0LzJIpV3Wh1reJ3",
				"ckwBpufkyGTq6oNnohhoWOwe6sE3",
				"uGXHAC1NSpYLQMsJTUTp8ybcinn2"
			]
		}
	},
	"messages": {
		"-NeE143qEojOyBNT_4_4": {
			"-NesCEpUUdkIvRUcRoLf": {
				"replyTo": "-NeEljH9w49Qk2J0RALS",
				"sentAt": "2023-09-21T14:46:35.165Z",
				"sentBy": "uGXHAC1NSpYLQMsJTUTp8ybcinn2",
				"text": "Testing "
			},
			"-NesCJ3DlIuyVsKNLAcT": {
				"replyTo": "-NeElEdDlDC4gBpygFIh",
				"sentAt": "2023-09-21T14:46:52.492Z",
				"sentBy": "uGXHAC1NSpYLQMsJTUTp8ybcinn2",
				"text": "Toyota Kirloskar Motor (TKM) posted a domestic tally of 20,970 units in the month of August 2023 as against 14,959 units during the same period last year with a YoY positive sales growth of 40 per cent in India. Compared to the previous month of July 2023 with 20,759 units, a MoM volume increase of 1 per cent was noted and edied",
				"type": "edited",
				"updatedAt": "2023-09-25T19:49:25.355Z"
			},
			"-Nf0nGb83tnruWN631bh": {
				"imageUrl": "https://firebasestorage.googleapis.com/v0/b/whatsapp-lite-rn.appspot.com/o/chatImages%2Fd508e388-011c-437b-b672-9800f5991a54?alt=media&token=25b7f99f-47b8-4e1a-babe-b2ce5bc664ad",
				"sentAt": "2023-09-23T11:29:18.861Z",
				"sentBy": "E5GvJxomD9O1zL3X89jeCbJDdku2",
				"text": "Image"
			},
			"-Nf1Ye3FbEFDin6_uIJj": {
				"sentAt": "2023-09-23T15:00:41.858Z",
				"sentBy": "E5GvJxomD9O1zL3X89jeCbJDdku2",
				"text": "Message deleted",
				"type": "deleted",
				"updatedAt": "2023-09-25T16:33:45.767Z"
			}
		}
	},
	"userChats": {
		"E5GvJxomD9O1zL3X89jeCbJDdku2": {
			"-NeE147xzF-6_Xe5cXlU": "-NeE143qEojOyBNT_4_4",
			"-Nf5aBtV6e8Isj1e9Tx7": "-Nf5aBln6fGFCBulN_MU",
			"-Nf5aCRrLfIBAMyHuUa1": "-Nf5aCCR2t9dUm02U6ED",
			"-Nf5aDA3Kz3FTDoLYbhB": "-Nf5aCuramYWJ7Nqp81p",
			"-Nf5aE9A3P6hb9nBQU1z": "-Nf5aDnmVKfYnjpcBHsM",
			"-Nf88s8MSbFzsIUS8jRU": "-Nf88s5katfKCG-utA_h"
		}
	},
	"userStatus": {
		"f9mcEU3MgrQaWEU3sQUzzeiPcBU2": {
			"-Nf895Lg3MpZeCVdGkbZ": {
				"createdAt": "2023-09-24T21:46:22.590Z",
				"imageUrl": "https://www.saalik.me/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdqxiycnxu%2Fimage%2Fupload%2Fv1660904364%2Fsaalik.me%2FIMG_20220115_225505_we3d2k.jpg&w=1080&q=75",
				"views": {
					"-NfB4ooFKW0n73yiqJk8": "E5GvJxomD9O1zL3X89jeCbJDdku2",
					"-NfB4pk-ftIznVrZdLyQ": "E5GvJxomD9O1zL3X89jeCbJDdku2",
					"-NfB4qBvPrSWyXr-27cg": "E5GvJxomD9O1zL3X89jeCbJDdku2"
				}
			},
			"-Nf89Pqt4ivv4t-vL73U": {
				"createdAt": "2023-09-24T21:47:46.571Z",
				"imageUrl": "https://www.saalik.me/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdqxiycnxu%2Fimage%2Fupload%2Fv1660904282%2Fsaalik.me%2FIMG_20220819_002437_icugad.jpg&w=1080&q=75",
				"views": {
					"-NfB4pDeAQ8RkHWImrrO": "E5GvJxomD9O1zL3X89jeCbJDdku2",
					"-NfB4pxVyLcB8qk2WLrM": "E5GvJxomD9O1zL3X89jeCbJDdku2",
					"-NfB4qNrXjIon1-ZbbPs": "E5GvJxomD9O1zL3X89jeCbJDdku2"
				}
			}
		}
	},
	"users": {
		"E5GvJxomD9O1zL3X89jeCbJDdku2": {
			"about": "how you all doing ?",
			"email": "tom@gmail.com",
			"firstLast": "tom carson",
			"firstName": "tom",
			"lastName": "carson",
			"profilePicture": "https://firebasestorage.googleapis.com/v0/b/whatsapp-lite-rn.appspot.com/o/profilePics%2Fa2f5bafb-435a-4e3a-92b5-6e26352ea056?alt=media&token=03f256f3-7150-42d9-ba52-029133e41e84",
			"pushTokens": {
				"-NfC0vTA4x-aIMZX9hjW": "ExponentPushToken[iuOhknI_zfWJo94-2u-8uW]"
			},
			"signUpDate": "2023-09-11T19:01:48.346Z",
			"userId": "E5GvJxomD9O1zL3X89jeCbJDdku2"
		}
	}
}
```

# Screenshots

|   |   |   |   |
|---|---|---|---|
|  ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695570098/WhatsApp-lite-rn/ea894jfirs2o3wiz2ygk.png) | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695570098/WhatsApp-lite-rn/jhnlsf5n0gtst53kk4cr.png)  | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695570097/WhatsApp-lite-rn/lxmwff5mv49vjap5vohe.png)  | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695570096/WhatsApp-lite-rn/bykp1fniu7tzmyrxpe7e.png)  |
|  ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695570096/WhatsApp-lite-rn/wjxhjdp57nv3y2546kbb.png)  |  ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695570096/WhatsApp-lite-rn/ac4yukwiqxlr2pox5upz.png)  | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695570095/WhatsApp-lite-rn/umapoogms7bkwdrafmve.png)  | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695570094/WhatsApp-lite-rn/dl4oograxfoabkspmri3.png)  |
|  ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695570093/WhatsApp-lite-rn/mka8bob4wbvulzqx1bwa.png) | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695570092/WhatsApp-lite-rn/bd82ya4ouibvo0aa200v.png)  | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695570091/WhatsApp-lite-rn/q9t5iwyw8hakr795o5yr.png)   | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695570091/WhatsApp-lite-rn/vxjyjmp8orufltvcmwyh.png)  |
|  ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695570090/WhatsApp-lite-rn/te78be72vhrova5niowr.png) | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695570090/WhatsApp-lite-rn/cx9v5i8qw7ayyz1tpymn.png)  | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695570090/WhatsApp-lite-rn/ufubztkvrhasioiep9s0.png) | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695570089/WhatsApp-lite-rn/wy0zs292shjzumsjbeaj.png) |
