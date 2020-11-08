import React from 'react';

interface Props {
	src: string;
	fallback: any;
	alt?: string;
	className?: string;
	style?: React.CSSProperties;
}

const LazyImage: React.FC<Props> = ({
	fallback,
	src,
	alt,
	className,
	style,
}) => {
	const [loaded, setLoaded] = React.useState(false);

	return (
		<>
			{!loaded && fallback}
			<img
				src={src}
				alt={alt}
				className={className}
				style={{
					...style,
					display: !loaded ? 'none' : style?.display,
				}}
				onLoad={() => setLoaded(true)}
			/>
		</>
	);
};

export default LazyImage;
