import { mode } from '@chakra-ui/theme-tools';
export const textareaStyles = {
	components: {
		Textarea: {
			baseStyle: {
				field: {
					fontWeight: 400,
					borderRadius: '8px'
				}
			},

			variants: {
				main: (props: any) => ({
					field: {
						bg: mode('transparent', 'navy.800')(props),
						border: '1px solid !important',
						color: mode('secondaryGray.900', 'white')(props),
						borderColor: mode('secondaryGray.100', 'whiteAlpha.100')(props),
						borderRadius: '16px',
						fontSize: 'sm',
						p: '20px',
						_placeholder: { color: mode('secondaryGray.400', 'secondaryGray.500')(props) }
					}
				}),
				auth: (props: any) => ({
					field: {
						bg: mode('white', 'navy.800')(props),
						border: '1px solid',
						color: mode('navy.700', 'white')(props),
						borderColor: mode('secondaryGray.100', 'rgba(135, 140, 189, 0.3)')(props),
						borderRadius: '16px',
						_placeholder: { color: 'secondaryGray.600' }
					}
				}),
				authSecondary: (props: any) => ({
					field: {
						bg: mode('white', 'navy.800')(props),
						border: '1px solid',
						color: mode('navy.700', 'white')(props),
						borderColor: mode('secondaryGray.100', 'rgba(135, 140, 189, 0.3)')(props),
						borderRadius: '16px',
						_placeholder: { color: 'secondaryGray.600' }
					}
				}),
				search: (props: any) => ({
					field: {
						border: 'none',
						py: '11px',
						borderRadius: 'inherit',
						color: mode('secondaryGray.900', 'white')(props),
						_placeholder: { color: mode('secondaryGray.600', 'secondaryGray.400')(props) }
					}
				})
			}
		}
	}
};
