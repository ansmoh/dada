home=$PWD
CWD=${PWD%/*}
cd $CWD
for i in `find ./ -maxdepth 1 -type d -regex '.*'`; do
	cd $home
	i=${i#*/}
	if [ ${#i} -gt 1 ]
	then
  sudo npm link ../$i
	fi
done
