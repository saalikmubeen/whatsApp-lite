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
