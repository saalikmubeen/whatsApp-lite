export function formatAmPm(dateString: string) {
	const date = new Date(dateString);
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let ampm = hours >= 12 ? "pm" : "am";
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	let mins: string | number = minutes < 10 ? "0" + minutes : minutes;
	return hours + ":" + mins + " " + ampm;
}

export function getTimeAgoOrTime(dateStr: string) {
	const currentDate = new Date();
	const inputDate = new Date(dateStr);
	const timeDifference = currentDate.valueOf() - inputDate.valueOf();

	const millisecondsInDay = 24 * 60 * 60 * 1000;
	const daysAgo = Math.floor(timeDifference / millisecondsInDay);

	if (daysAgo === 0) {
		// Within the same day, return the time in 12-hour format with AM/PM
		const hours = inputDate.getHours();
		const minutes = inputDate.getMinutes();
		const amOrPm = hours >= 12 ? "PM" : "AM";
		const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
		return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${amOrPm}`;
	} else if (daysAgo === 1) {
		// Yesterday
		const hours = inputDate.getHours();
		const minutes = inputDate.getMinutes();
		const amOrPm = hours >= 12 ? "PM" : "AM";
		const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
		return `Yesterday at ${formattedHours}:${minutes.toString().padStart(2, "0")} ${amOrPm}`;
	} else if (daysAgo <= 10) {
		// Within 10 days
		const hours = inputDate.getHours();
		const minutes = inputDate.getMinutes();
		const amOrPm = hours >= 12 ? "PM" : "AM";
		const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
		return `${daysAgo} days ago at ${formattedHours}:${minutes.toString().padStart(2, "0")} ${amOrPm}`;
	} else {
		// More than 10 days ago, return the full date and time
		const day = inputDate.getDate();
		const month = inputDate.toLocaleString("default", { month: "short" });
		const year = inputDate.getFullYear();
		const hours = inputDate.getHours();
		const minutes = inputDate.getMinutes();
		const amOrPm = hours >= 12 ? "PM" : "AM";
		const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
		return `${day} ${month} ${year} ${formattedHours}:${minutes.toString().padStart(2, "0")} ${amOrPm}`;
	}
}

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export function getDayAndDate(dateStr: string) {
	const currentDate = new Date();
	const inputDate = new Date(dateStr);
	const timeDifference = currentDate.valueOf() - inputDate.valueOf();

	const millisecondsInDay = 24 * 60 * 60 * 1000;
	const daysAgo = Math.floor(timeDifference / millisecondsInDay);
	console.log(daysAgo);

	if (daysAgo === 0) {
		// Within the same day, return "Today"
		return "Today";
	} else if (daysAgo === 1) {
		// One day ago, return "Yesterday"
		return "Yesterday";
	} else if (daysAgo <= 7) {
		// Within 7 days, return the name of the day of the week
		const dayOfWeek = days[inputDate.getDay()];
		return dayOfWeek;
	} else {
		// More than 7 days ago, return the date in the format "Wed, 6 Sep 2023"
		const formattedDate = inputDate.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
		return formattedDate;
	}
}
