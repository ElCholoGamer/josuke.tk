module.exports = {
	moduleFileExtensions: ['ts', 'tsx', 'js'],
	transform: {
		'\\.(ts|tsx)$': 'ts-jest',
	},
	globals: {
		'ts-jest': {
			tsconfig: 'tsconfig.json',
		},
	},
	testMatch: ['**/__tests__/*.+(ts|tsx|js)'],
};
