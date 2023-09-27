# WhatsApp Lite

***Not just another whatsApp Clone but more.***

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
-   `Group chat` and `private chats`
-   `Send images` in chat
-   `Push notifications` for new messages
-   User profile with profile pictures
-   Uploading group chat images
-   Search for other users
-   Leaving group chats and removing other users from group chats
-   Realtime `delete messages for everyone` feature like in WhatsApp
-   `Reply to individual messages` in chat by taggging the messages like in WhatsApp
-   `Edit messages` in chat in realtime like in WhatsApp
-   `Upload Status with images like in WhatsApp`
-   `Status views list feature along with time of view` like in WhatsApp
-   Delete status feature
-   `Blue ticks` for seen messages with `time of seen` like in WhatsApp with `realtime updates`
-   `List of users who have seen the message with time of seen` like in WhatsApp for group chats

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
		"chatId1": {
			"createdAt": "2023-09-24T09:45:02.472Z",
			"createdBy": "userId1",
			"isGroupChat": false,
			"latestMessageText": "Hey",
			"updatedAt": "2023-09-24T09:45:03.599Z",
			"updatedBy": "userId2",
			"users": ["userId1", "userId2"]
		},
		"chatId2": {
			"chatImage": "https://firebasestorage.googleapis.com/v0/b/whatsapp-lite-rn.appspot.com/o/profilePics%2F1ab3dd26-04d5-4eee-a9c5-72bb05d02e7e?alt=media&token=5265a9c8-5f4d-46c2-b077-01b5119e46d7",
			"chatName": "Developers Group",
			"createdAt": "2023-09-24T09:50:17.183Z",
			"createdBy": "userId2",
			"isGroupChat": true,
			"latestMessageText": "tom carson added testt test to the chat",
			"updatedAt": "2023-09-24T10:36:14.032Z",
			"updatedBy": "userId1",
			"users": ["userId1", "userId2", "userId3", "userId4", "userId5", "userId6"]
		}
	},
	"messages": {
		"chatId1": {
			"messageId1": {
				"replyTo": "-NeEljH9w49Qk2J0RALS",
				"sentAt": "2023-09-21T14:46:35.165Z",
				"sentBy": "userId4",
				"text": "Testing "
			},
			"messageId2": {
				"replyTo": "-NeElEdDlDC4gBpygFIh",
				"sentAt": "2023-09-21T14:46:52.492Z",
				"sentBy": "userId3",
				"text": "Toyota Kirloskar Motor (TKM) posted a domestic tally of 20,970 units in the month of and edied",
				"type": "edited",
				"updatedAt": "2023-09-25T19:49:25.355Z"
			},
			"messageId3": {
				"imageUrl": "https://firebasestorage.googleapis.com/v0/b/whatsapp-lite-rn.appspot.com/o/chatImages%2Fd508e388-011c-437b-b672-9800f5991a54?alt=media&token=25b7f99f-47b8-4e1a-babe-b2ce5bc664ad",
				"sentAt": "2023-09-23T11:29:18.861Z",
				"sentBy": "userId2",
				"text": "Image"
			},
			"messageId4": {
				"sentAt": "2023-09-23T15:00:41.858Z",
				"sentBy": "userId1",
				"text": "Message deleted",
				"type": "deleted",
				"updatedAt": "2023-09-25T16:33:45.767Z"
			},
			"messageId5": {
				"seen": {
					"-NfGPdC_L9g2odRgTAdp": {
						"seenAt": "2023-09-26T12:15:37.098Z",
						"seenBy": "userId1"
					},
					"-NfHm46UajDoIH5Wmr_k": {
						"seenAt": "2023-09-26T18:37:38.198Z",
						"seenBy": "userId2"
					}
				},
				"sentAt": "2023-09-23T11:46:20.166Z",
				"sentBy": "userId3",
				"text": "It was great"
			}
		}
	},
	"userChats": {
		"userId1": {
			"-NeE147xzF-6_Xe5cXlU": "chatId1",
			"-Nf5aBtV6e8Isj1e9Tx7": "chatId2",
			"-Nf5aCRrLfIBAMyHuUa1": "chatId3",
			"-Nf5aDA3Kz3FTDoLYbhB": "chatId4"
		},
		"userId2": {
			"-Nf5aE9A3P6hb9nBQU1z": "chatId5",
			"-Nf88s8MSbFzsIUS8jRU": "chatId6"
		}
	},
	"userStatus": {
		"userId1": {
			"statusId1": {
				"createdAt": "2023-09-24T21:46:22.590Z",
				"imageUrl": "https://www.saalik.me/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdqxiycnxu%2Fimage%2Fupload%2Fv1660904364%2Fsaalik.me%2FIMG_20220115_225505_we3d2k.jpg&w=1080&q=75",
				"views": {
					"-NfB4ooFKW0n73yiqJk8": {
						"viewerId": "userId2",
						"viewedAt": "2023-09-24T21:46:24.590Z"
					},
					"-NfB4pk-ftIznVrZdLyQ": {
						"viewerId": "userId3",
						"viewedAt": "2023-09-24T21:46:25.590Z"
					},
					"-NfB4qBvPrSWyXr-27cg": {
						"viewerId": "userId4",
						"viewedAt": "2023-09-24T21:46:26.590Z"
					}
				}
			},
			"statusId2": {
				"createdAt": "2023-09-24T21:47:46.571Z",
				"imageUrl": "https://www.saalik.me/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdqxiycnxu%2Fimage%2Fupload%2Fv1660904282%2Fsaalik.me%2FIMG_20220819_002437_icugad.jpg&w=1080&q=75",
				"views": {
					"-NfB4pDeAQ8RkHWImrrO": {
						"viewerId": "userId2",
						"viewedAt": "2023-09-24T21:47:48.571Z"
					},
					"-NfB4pxVyLcB8qk2WLrM": {
						"viewerId": "userId3",
						"viewedAt": "2023-09-24T21:47:49.571Z"
					},
					"-NfB4qNrXjIon1-ZbbPs": {
						"viewerId": "userId6",
						"viewedAt": "2023-09-24T21:47:50.571Z"
					}
				}
			}
		}
	},
	"users": {
		"userId1": {
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
			"userId": "userId1"
		}
	}
}

```

# Screenshots

|     |     |     |     |
|-----|-----|-----|-----|
| ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764027/WhatsApp-lite-rn/r2j9myyd8v4qqm07dqvi.png)  | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764028/WhatsApp-lite-rn/sf3q17fl9jcvj3napei4.png)   | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764028/WhatsApp-lite-rn/s3aqsj6nd3iysdtqg8zo.png)   | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764030/WhatsApp-lite-rn/xcp5rxkjyjshdqaaygze.png)   |
| ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764029/WhatsApp-lite-rn/hsskeycxrrqskbykyzwf.png)   | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764030/WhatsApp-lite-rn/p276yxdmtvmlshymljex.png)   | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764030/WhatsApp-lite-rn/zhwhlvnzi4r7jfww7t4d.png)  | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764034/WhatsApp-lite-rn/r8hjleq24hyl1bbni9rd.png)   |
| ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764029/WhatsApp-lite-rn/mliyveeylt0dyjkeuyrc.png)   | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764036/WhatsApp-lite-rn/s1tayrhlbnnaj4eqsszj.png)  | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764033/WhatsApp-lite-rn/jzljofosdpqdpoyqs51m.png)  | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764033/WhatsApp-lite-rn/uhsrttr0kkvkxbbfuj0q.png) |
| ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764034/WhatsApp-lite-rn/k0tnylmyspobdkl1b84o.png)  | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764030/WhatsApp-lite-rn/byyknpglqkvihvo0y0ts.png)  | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764030/WhatsApp-lite-rn/pok7qro7lo9amskj6aac.png) | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764028/WhatsApp-lite-rn/yplddumulm1hq1sidfcf.png)  |
| ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764031/WhatsApp-lite-rn/zdc0y7fkdvvjlsrsmoiy.png)  | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764032/WhatsApp-lite-rn/xzk9mwam6fqvum0nr1hk.png)  | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764033/WhatsApp-lite-rn/lxjscya9qiwhl4xfybrf.png) | ![image](https://res.cloudinary.com/dqxiycnxu/image/upload/v1695764035/WhatsApp-lite-rn/aobnfxk07thfbonl0hj3.png)  |

 

 
<!-- |     |     |     |     |
|-----|-----|-----|-----|
| 1   | 2   | 3   | 4   |
| 5   | 6   | 7   | 8   |
| 9   | 10  | 11  | 12  |
| 13  | 14  | 15  | 16  |
| 17  | 18  | 19  | 20  | -->
