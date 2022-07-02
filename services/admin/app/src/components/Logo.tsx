import { Box, ImageProps, useToken } from '@chakra-ui/react';
import * as React from 'react';

interface LogoProps extends React.ComponentProps<typeof Box> {
  backgroundFill: ImageProps['fill'];
  fill: ImageProps['fill'];
}

export function Logo(props: LogoProps) {
  const { backgroundFill: _backgroundFill, fill: _fill, ...rest } = props;
  const [backgroundFill, fill] = useToken('colors', [
    _backgroundFill as string,
    _fill as string,
  ]);

  return (
    <Box {...rest}>
      <svg viewBox="0 0 500 500" version="1.1">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <rect fill={backgroundFill} x="0" y="0" width="500" height="500" />
          <rect
            x="163"
            y="94"
            width="175"
            height="175"
            display="none"
            fill={fill}
          />
          <svg
            width="175"
            height="175"
            viewBox="0 0 175 175"
            version="1.1"
            x="163"
            y="94"
            fill={fill}
          >
            <g stroke={fill} strokeWidth="1" fill="none" fillRule="evenodd">
              <polygon
                fill={fill}
                points="87 0 162 43.75 162 131.25 87 175 12 131.25 12 43.75"
              />
            </g>
          </svg>
          <path
            d="M178.443 329.438l134.543 -247.05l0.575 -1.056l-2.086 -1.164l-0.574 1.056l-134.544 247.05l-0.575 1.056l2.086 1.164l0.575 -1.056zm71.439 0l134.543 -247.05l0.575 -1.056l-2.085 -1.164l-0.575 1.056l-134.544 247.05l-0.575 1.056l2.086 1.164l0.575 -1.056zm-115.46 32.473l130.971 -279.59l0.51 -1.088l-2.151 -1.033l-0.51 1.089l-130.972 279.59l-0.51 1.088l2.151 1.033l0.51 -1.089zm192.725 -30.21l-209.554 -255.486l-0.76 -0.927l-1.833 1.54l0.76 0.927l209.555 255.487l0.76 0.927l1.833 -1.54l-0.76 -0.927zm42.926 -36.07l-200.03 -291.641l-0.679 -0.99l-1.956 1.374l0.68 0.99l200.029 291.641l0.679 0.99l1.956 -1.374l-0.68 -0.99z"
            id="shape.primary"
            fill={backgroundFill}
          />
          <g transform="translate(40.000000, 295.000000)">
            <rect x="0" y="0" width="420" height="60" />
            <text
              fill={fill}
              fontFamily="Nova Mono"
              fontSize="50"
              fontWeight="400"
              letterSpacing="3"
              data-text-alignment="C"
              fontStyle="normal"
            >
              <tspan x="147.84621047973633" y="44">
                envo
              </tspan>
            </text>
          </g>
        </g>
      </svg>
    </Box>
  );
}
