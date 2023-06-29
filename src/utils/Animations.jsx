import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { forwardRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

export const NavbarAnimationOnScroll = (element) => {
	gsap.fromTo(
		// Scroll animation
		element.querySelector('.navbar'),
		{
			background: 'none',
			color: 'white',
		},
		{
			background: '#0b0d12',
			color: 'black',
			duration: 0.1,
			scrollTrigger: {
				trigger: element.querySelector('.recap-container'),
				start: '-500px',
				end: 'bottom top',
				scrub: true,
				toggleActions: 'play none none reverse',
			},
		}
	);
};

export const NavbarMobileAnimationOnScroll = (element) => {
	gsap.to(
		// Scroll animation
		element.querySelector('.navbar-mobile'),
		{
			background: '#0b0d12',
			duration: 0.1,
			scrollTrigger: {
				trigger: element.querySelector('.recap-container'),
				start: '-500px',
				end: 'bottom top',
				scrub: true,
				toggleActions: 'play none none reverse',
			},
		}
	);
};

export const animateOverlay = (forwardedRef, timeline) => {
	gsap.context(() => {
		timeline.current = gsap
			.timeline()
			.timeScale(1.4)
			.fromTo(
				'.welcome',
				{
					opacity: 0,
					y: -50,
				},
				{
					opacity: 1,
					y: 0,
					delay: 0.4,
				}
			)
			.fromTo(
				'.overlay-name',
				{
					opacity: 0,
					y: -50,
				},
				{
					opacity: 1,
					y: 0,
				}
			)
			.fromTo(
				'.divider',
				{
					opacity: 0,
					y: -50,
				},
				{
					opacity: 1,
					y: 0,
				}
			)
			.fromTo(
				'.overlay-food',
				{
					opacity: 0,
					y: -50,
				},
				{
					opacity: 1,
					y: 0,
				}
			)
			.fromTo(
				'.overlay-btn',
				{
					opacity: 0,
					y: -100,
				},
				{
					opacity: 1,
					y: 0,
				}
			);
	}, forwardedRef);
	return () => {
		timeline.kill();
	};
};

export const animateRecap = (element) => {
	gsap.fromTo(
		// Scroll animation
		element.querySelector('.recap-content'),
		{
			opacity: 0,
		},
		{
			opacity: 1,
			duration: 0.6,
			scrollTrigger: {
				trigger: element.querySelector('.recap-container'),
				start: 'center center',
				end: 'center center',
				pin: true,
				toggleActions: 'play none none reverse',
				once: true,
			},
		}
	);
};

export const animateRecapIcons = () => {
	let elements = gsap.utils.toArray('.recap-card');

	elements.forEach((el) => {
		gsap.fromTo(
			el,
			{
				opacity: 0,
				y: -100,
			},
			{
				duration: 1,
				y: 0,
				opacity: 1,
				delay: 0.4,
				ease: 'power1.in',
				scrollTrigger: {
					trigger: el,
					start: 'center center',
					end: 'center center',
					pin: true,
					toggleActions: 'play none none reverse',
					once: true,
				},
			}
		);
	});
};

export const animateInfo = (forwardedRef, timeline) => {
	const element = forwardedRef.current;
	gsap.context(() => {
		timeline.current = gsap
			.timeline({
				scrollTrigger: {
					trigger: element.querySelector('.recap-info-container'),
					start: 'center center',
					end: 'center center',
					toggleActions: 'play none none reverse',
					once: true,
				},
			})
			.timeScale(1.2)
			.fromTo(
				'.info-left',
				{
					opacity: 0,
					x: -50,
				},
				{
					opacity: 1,
					x: 0,
				}
			)
			.fromTo(
				'.info-right',
				{
					opacity: 0,
					x: 50,
				},
				{
					opacity: 1,
					x: 0,
				}
			);
	}, forwardedRef);
	return () => {
		timeline.kill();
	};
};

export const animateContactSection = (forwardedRef, timeline) => {
	const element = forwardedRef.current;
	gsap.context(() => {
		timeline.current = gsap
			.timeline({
				scrollTrigger: {
					trigger: element.querySelector('.contact-section-container'),
					start: 'center center',
					end: 'center center',
					toggleActions: 'play none none reverse',
					once: true,
				},
			})
			.timeScale(1.2)
			.fromTo(
				'.address',
				{
					opacity: 0,
					x: -50,
				},
				{
					opacity: 1,
					x: 0,
				}
			)
			.fromTo(
				'.menu',
				{
					opacity: 0,
					x: 50,
				},
				{
					opacity: 1,
					x: 0,
				}
			);
	}, forwardedRef);
	return () => {
		timeline.kill();
	};
};

export const animateStory = (forwardedRef, timeline) => {
	const element = forwardedRef.current;
	console.log(forwardedRef);
	gsap.context(() => {
		timeline.current = gsap
			.timeline({
				scrollTrigger: {
					trigger: element.querySelector('.story-container'),
					start: 'top center',
					end: 'center center',
					once: true,
				},
			})
			.fromTo(
				'.left-story h1',
				{
					opacity: 0,
					x: -50,
				},
				{
					opacity: 1,
					x: 0,
				}
			)
			.fromTo(
				'.left-story h2',
				{
					opacity: 0,
					x: 50,
				},
				{
					opacity: 1,
					x: 0,
				}
			)
			.fromTo(
				'.left-story span',
				{
					opacity: 0,
					x: -50,
				},
				{
					opacity: 1,
					x: 0,
				}
			)
			.fromTo(
				'.right-story img',
				{
					opacity: 0,
					x: -50,
				},
				{
					opacity: 1,
					x: 0,
				}
			)
			.fromTo(
				'.left-story-text',
				{
					opacity: 0,
					x: -50,
				},
				{
					opacity: 1,
					x: 0,
				}
			);
	}, forwardedRef);
	return () => {
		timeline.kill();
	};
};

export const animateOurDishesSection = (forwardedRef, timeline) => {
	const element = forwardedRef.current;
	console.log(element);
	gsap.context(() => {
		timeline.current = gsap
			.timeline({
				scrollTrigger: {
					trigger: element,
					start: 'top center',
					end: 'center center',
					once: true,
				},
			})
			.fromTo(
				'.pictures h2',
				{
					opacity: 0,
					x: -50,
				},
				{
					opacity: 1,
					x: 0,
				}
			)
			.fromTo(
				'.pictures h1',
				{
					opacity: 0,
					x: 50,
				},
				{
					opacity: 1,
					x: 0,
				}
			);
	}, forwardedRef);
	return () => {
		timeline.kill();
	};
};

export const animateGallery = (forwardedRef, timeline) => {
	const element = forwardedRef.current;
	console.log(element);
	gsap.context(() => {
		timeline.current = gsap
			.timeline({
				scrollTrigger: {
					trigger: element,
					start: 'top center',
					end: 'buttom buttom',
					once: true,
				},
			})
			.fromTo(
				'.img1',
				{
					opacity: 0,
					x: -50,
				},
				{
					opacity: 1,
					x: 0,
				}
			)
			.fromTo(
				'.img2',
				{
					opacity: 0,
					x: 50,
				},
				{
					opacity: 1,
					x: 0,
				}
			)
			.fromTo(
				'.img3',
				{
					opacity: 0,
					x: 50,
				},
				{
					opacity: 1,
					x: 0,
				}
			)
			.fromTo(
				'.img4',
				{
					opacity: 0,
					x: -50,
				},
				{
					opacity: 1,
					x: 0,
				}
			)
			.fromTo(
				'.img5',
				{
					opacity: 0,
					x: -50,
				},
				{
					opacity: 1,
					x: 0,
				}
			)
			.fromTo(
				'.img6',
				{
					opacity: 0,
					x: 50,
				},
				{
					opacity: 1,
					x: 0,
				}
			);
	}, forwardedRef);
	return () => {
		timeline.kill();
	};
};

export const galeryImgClick = (forwardedRef, timeline) => {
	gsap.context(() => {
		timeline.current = gsap
			.timeline()
			.timeScale(1.5)
			.fromTo(
				'.image-modal-overlay',
				{
					opacity: 0,
				},
				{
					opacity: 1,
				}
			)
			.fromTo(
				'.image-modal',
				{
					opacity: 0,
					y: -150,
				},
				{
					opacity: 1,
					y: 0,
					duration: 1,
				}
			);
	}, forwardedRef);
	return () => {
		timeline.kill();
	};
};

export const galeryImgClickClose = (forwardedRef, timeline) => {
	console.log(forwardedRef);
	gsap.context(() => {
		timeline.current = gsap
			.timeline()
			.timeScale(1.5)
			.fromTo(
				'.image-modal',
				{
					opacity: 1,
					y: 0,
				},
				{
					opacity: 0,
					y: -150,
					duration: 1,
				}
			)
			.fromTo(
				'.image-modal-overlay',
				{
					opacity: 1,
				},
				{
					opacity: 0,
				}
			);
	}, forwardedRef);
	return () => {
		timeline.kill();
	};
};

export const animateMap = (forwardedRef, timeline) => {
	const element = forwardedRef.current;
	console.log(element);
	gsap.fromTo(
		// Scroll animation
		element,
		{
			opacity: 0,
		},
		{
			opacity: 1,
			duration: 1.4,
			scrollTrigger: {
				trigger: element,
				start: 'top center',
				end: 'buttom buttom',
				once: true,
			},
		}
	);
};

export const animateReservations = (forwardedRef, timeline) => {
	const element = forwardedRef.current;
	console.log(element);
	gsap.context(() => {
		timeline.current = gsap
			.timeline({
				scrollTrigger: {
					trigger: element,
					start: 'top center',
					end: 'buttom buttom',
					once: true,
				},
			})
			.fromTo(
				'.reservation-box',
				{
					opacity: 0,
					x: -50,
				},
				{
					opacity: 1,
					x: 0,
				}
			)
			.fromTo(
				'.reservation-box h1',
				{
					opacity: 0,
					x: 50,
				},
				{
					opacity: 1,
					x: 0,
				}
			)
			.fromTo(
				'.input-name',
				{
					opacity: 0,
					y: -50,
				},
				{
					opacity: 1,
					y: 0,
				}
			)
			.fromTo(
				'.input-phone',
				{
					opacity: 0,
					y: -50,
				},
				{
					opacity: 1,
					y: 0,
				}
			)
			.fromTo(
				'.input-persons',
				{
					opacity: 0,
					y: 50,
				},
				{
					opacity: 1,
					y: 0,
				}
			)
			.fromTo(
				'.input-date',
				{
					opacity: 0,
					y: 50,
				},
				{
					opacity: 1,
					y: 0,
				}
			)
			.fromTo(
				'.input-time',
				{
					opacity: 0,
					y: 50,
				},
				{
					opacity: 1,
					y: 0,
				}
			)
			.fromTo(
				'.submit-button-container',
				{
					opacity: 0,
					y: 50,
				},
				{
					opacity: 1,
					y: 0,
				}
			);
	}, forwardedRef);
	return () => {
		timeline.kill();
	};
};
