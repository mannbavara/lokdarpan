import { mode } from '@chakra-ui/theme-tools';
export const progressStyles = {
	components: {
		Progress: {
			baseStyle: {
				track: {
					borderRadius: '20px',
					},
		         	 filledTrack: {
        		   	borderRadius: '20px'
           		}
				
			},

			variants: {
				table: (props: any) => ({
					track: {
						borderRadius: '20px',
						bg: mode('blue.50', 'whiteAlpha.50')(props),
						h: '8px',
						w: '54px'
					}
				})
			}
		}
	}
};
