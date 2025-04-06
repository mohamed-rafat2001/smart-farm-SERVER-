const filterObject = (obj, ...allows) => {
	const newObj = {};

	Object.keys(obj).forEach((el) => {
		if (allows.includes(el)) newObj[el] = obj[el];
	});

	return newObj;
};
export default filterObject;
