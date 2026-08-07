<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'u222853241_LRHKp' );

/** Database username */
define( 'DB_USER', 'u222853241_CkHeb' );

/** Database password */
define( 'DB_PASSWORD', 'wq2aE!e/ut' );

/** Database hostname */
define( 'DB_HOST', '127.0.0.1' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          '0MA9-e@a9$ph_.n^IhP9=?D@,9.$DSv>$hQl6C/r;qL^r=-KJ[nto|?lRj4%Cd2C' );
define( 'SECURE_AUTH_KEY',   'Bn7,quHpzA8n5L}|n7]Xm;KO_6=z{7d&LTFN=Ls%Fzq]p,d98lL=Q(|^kikX7}N}' );
define( 'LOGGED_IN_KEY',     'yC.thd,8:O5=%Z$lw#z.-U,|:]Ay4&M6V#)az&l`Z`c{ZR$t#LEZ{MAl>HtA[fM-' );
define( 'NONCE_KEY',         '.j$O]%)k?msYb`#QV]l/l@JE{o5:x9<+s|jrYgZ*i%?.5a)jHC&.#epO:hP)yuS~' );
define( 'AUTH_SALT',         'b:BC(Tu=Q@1 L_]Qz;&+-QX.(k%wD1Wcy1sFy8o`&l>C0){S)6J@|3|WH<On3/q*' );
define( 'SECURE_AUTH_SALT',  'jli@^r*<dT8r *0pHb]7/4yV~W@+XGO8U8At6m>A`u&z1T?){N0dcVF?E]W1G>IF' );
define( 'LOGGED_IN_SALT',    '-GM:vU%X$%<k<5WS#oc7W.D?fe(+ENde-v<Faf<6=QVcO6r5R}=tE2txS_Mq=|][' );
define( 'NONCE_SALT',        'tG5,wVX[,@1vQ#Sfkhk?_w4J@z-~r/g)1uuiHruH2Y(6OzV`$T.oQmvR+t=uxTJP' );
define( 'WP_CACHE_KEY_SALT', '@P*y0,KQ8{Q}w(5*#Hso:>j[;y2|IQz. Ja-]6R!M SxvR;kpPqxrTV%?-[{S!cZ' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'FS_METHOD', 'direct' );
define( 'COOKIEHASH', '1522b4300bfb7c0f62f5afaab0b0365d' );
define( 'WP_AUTO_UPDATE_CORE', 'minor' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
